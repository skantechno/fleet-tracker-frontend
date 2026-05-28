<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import FleetMap from '@/components/map/FleetMap.vue'
import VehicleSidebar from '@/components/sidebar/VehicleSidebar.vue'
import HistoryReplaySlider from '@/components/map/HistoryReplaySlider.vue'
import AlertToast from '@/components/alerts/AlertToast.vue'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAlertsStore } from '@/stores/alerts'
import { useGeofencesStore } from '@/stores/geofences'
import { useAuthStore } from '@/stores/auth'
import { useSocket } from '@/composables/useSocket'
import { useVehicles } from '@/composables/useVehicles'
import { useAlerts } from '@/composables/useAlerts'
import { useHistoryReplay } from '@/composables/useHistoryReplay'
import type { Alert, Vehicle } from '@/types/api'
import type { LatLngTuple } from '@/utils/geo'

const vehicles = useVehiclesStore()
const alerts = useAlertsStore()
const geofences = useGeofencesStore()
const { positioned, loading, error, selected, selectedId, selectedSpeedHistory } =
  storeToRefs(vehicles)
const { list: geofenceList } = storeToRefs(geofences)

const focusTarget = ref<LatLngTuple | null>(null)

function onSelect(vehicle: Vehicle) {
  vehicles.select(vehicle.id)
}

function onAlertSelect(alert: Alert) {
  const vehicle = vehicles.byId[alert.vehicleId]
  vehicles.select(alert.vehicleId)
  if (vehicle && vehicle.lastLat !== null && vehicle.lastLng !== null) {
    // new tuple each time so the FleetMap focus watcher always re-fires
    focusTarget.value = [vehicle.lastLat, vehicle.lastLng]
  }
}

const auth = useAuthStore()
const { connect, disconnect } = useSocket()

const replay = useHistoryReplay()
const replayVisible = ref(false)

// Load history whenever the selected vehicle changes; clear when deselected.
watch(selectedId, (id) => {
  if (id) {
    replayVisible.value = true
    replay.load(id)
  } else {
    replayVisible.value = false
    replay.clear()
  }
})

// Only overlay the trail/replay marker once the user engages the timeline,
// so a freshly selected vehicle just shows its live marker.
const showReplayOverlay = computed(
  () => replayVisible.value && replay.active.value && (replay.playing.value || replay.progress.value > 0),
)

function closeReplay() {
  replay.pause()
  replayVisible.value = false
}

let unbindVehicles: (() => void) | null = null
let unbindAlerts: (() => void) | null = null

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedId.value) {
    vehicles.deselect()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  await Promise.all([
    vehicles.fetchAll(),
    alerts.fetchAll(),
    geofences.fetchAll(),
  ])
  if (auth.token) {
    connect(auth.token)
    unbindVehicles = useVehicles()
    unbindAlerts = useAlerts()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  unbindVehicles?.()
  unbindAlerts?.()
  disconnect()
  replay.clear()
})
</script>

<template>
  <div class="flex h-screen flex-col bg-surface-950">
    <AppHeader @alert-select="onAlertSelect" />
    <AlertToast />
    <main class="relative flex min-h-0 flex-1">
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="relative min-h-0 flex-1">
          <FleetMap
            :vehicles="positioned"
            :geofences="geofenceList"
            :trail="showReplayOverlay ? replay.trail.value : []"
            :replay-position="showReplayOverlay ? replay.replayPosition.value : null"
            :focus="focusTarget"
            @select="onSelect"
            @deselect="vehicles.deselect"
          />

          <div
            v-if="loading"
            class="absolute left-1/2 top-4 z-1000 -translate-x-1/2 rounded-full bg-surface-900/90 px-4 py-1.5 text-sm text-surface-300 shadow"
          >
            Loading fleet…
          </div>
          <div
            v-else-if="error"
            class="absolute left-1/2 top-4 z-1000 -translate-x-1/2 rounded-full bg-red-900/90 px-4 py-1.5 text-sm text-red-100 shadow"
          >
            {{ error }}
          </div>
        </div>

        <HistoryReplaySlider
          v-if="replayVisible && selected"
          :vehicle-name="selected.name"
          :loading="replay.loading.value"
          :playing="replay.playing.value"
          :multiplier="replay.multiplier.value"
          :progress="replay.progress.value"
          :current-time="replay.currentTime.value"
          :from-time="replay.fromTime.value"
          :to-time="replay.toTime.value"
          @seek="replay.seek"
          @toggle-play="replay.togglePlay"
          @set-speed="replay.setMultiplier"
          @close="closeReplay"
        />
      </div>

      <VehicleSidebar
        v-if="selected"
        :vehicle="selected"
        :samples="selectedSpeedHistory"
        @close="vehicles.deselect"
      />
    </main>
  </div>
</template>
