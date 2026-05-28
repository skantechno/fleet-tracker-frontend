<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import FleetMap from '@/components/map/FleetMap.vue'
import VehicleSidebar from '@/components/sidebar/VehicleSidebar.vue'
import HistoryReplaySlider from '@/components/map/HistoryReplaySlider.vue'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAuthStore } from '@/stores/auth'
import { useSocket } from '@/composables/useSocket'
import { useVehicles } from '@/composables/useVehicles'
import { useHistoryReplay } from '@/composables/useHistoryReplay'
import type { Vehicle } from '@/types/api'

const vehicles = useVehiclesStore()
const { positioned, loading, error, selected, selectedId, selectedSpeedHistory } =
  storeToRefs(vehicles)

function onSelect(vehicle: Vehicle) {
  vehicles.select(vehicle.id)
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

onMounted(async () => {
  await vehicles.fetchAll()
  if (auth.token) {
    connect(auth.token)
    unbindVehicles = useVehicles()
  }
})

onBeforeUnmount(() => {
  unbindVehicles?.()
  disconnect()
  replay.clear()
})
</script>

<template>
  <div class="flex h-screen flex-col bg-surface-950">
    <AppHeader />
    <main class="relative flex min-h-0 flex-1">
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="relative min-h-0 flex-1">
          <FleetMap
            :vehicles="positioned"
            :trail="showReplayOverlay ? replay.trail.value : []"
            :replay-position="showReplayOverlay ? replay.replayPosition.value : null"
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
