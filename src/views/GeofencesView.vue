<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Skeleton from 'primevue/skeleton'
import AppHeader from '@/components/layout/AppHeader.vue'
import GeofencePolygon from '@/components/map/GeofencePolygon.vue'
import { useGeofencesStore } from '@/stores/geofences'
import type { GeofenceType } from '@/types/api'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  GEOFENCE_COLOR,
} from '@/utils/geo'

// leaflet-draw augments this Leaflet instance. Expose it as the global so
// vue-leaflet (use-global-leaflet) builds the map on the SAME instance —
// otherwise the draw control attaches to a different Leaflet and renders
// detached from the map's control corner.
;(window as unknown as { L: typeof L }).L = L

const geofences = useGeofencesStore()
const { list, loading } = storeToRefs(geofences)

const typeOptions: GeofenceType[] = ['allow', 'deny']

const dialogVisible = ref(false)
const draftName = ref('')
const draftType = ref<GeofenceType>('deny')
const draftCoordinates = ref<[number, number][]>([])
const saving = ref(false)

function onMapReady(map: L.Map) {
  // The map mounts inside a flex layout that settles after init; recompute
  // its size on the next tick so tiles and controls lay out correctly.
  nextTick(() => map.invalidateSize())

  const drawControl = new L.Control.Draw({
    draw: {
      // showArea:true triggers a readableArea ReferenceError in
      // leaflet-draw 1.0.4 on Leaflet 1.9, so keep it off.
      polygon: { allowIntersection: false, showArea: false },
      polyline: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false,
    },
    edit: undefined,
  })
  map.addControl(drawControl)

  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = (event as L.DrawEvents.Created).layer as L.Polygon
    const ring = (layer.getLatLngs() as L.LatLng[][])[0]
    draftCoordinates.value = ring.map((p) => [p.lat, p.lng])
    draftName.value = ''
    draftType.value = 'deny'
    dialogVisible.value = true
  })
}

async function save() {
  if (!draftName.value.trim() || draftCoordinates.value.length < 3) return
  saving.value = true
  try {
    await geofences.create({
      name: draftName.value.trim(),
      type: draftType.value,
      coordinates: draftCoordinates.value,
    })
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  geofences.fetchAll()
})
</script>

<template>
  <div class="flex h-screen flex-col bg-surface-950">
    <AppHeader />
    <main class="flex min-h-0 flex-1">
      <aside
        class="flex w-72 shrink-0 flex-col border-r border-surface-800 bg-surface-900"
      >
        <header class="border-b border-surface-800 px-4 py-3">
          <h2 class="text-sm font-semibold text-surface-100">Geofences</h2>
          <p class="text-xs text-surface-500">
            Draw a polygon on the map to add one
          </p>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto">
          <div v-if="loading" class="flex flex-col gap-3 px-4 py-3">
            <Skeleton v-for="n in 3" :key="n" height="2.5rem" />
          </div>
          <div
            v-else-if="list.length === 0"
            class="px-4 py-6 text-center text-sm text-surface-500"
          >
            No geofences yet
          </div>
          <ul v-else>
            <li
              v-for="g in list"
              :key="g.id"
              class="flex items-center justify-between gap-2 border-b border-surface-800 px-4 py-3"
            >
              <div class="flex min-w-0 items-center gap-2">
                <span
                  class="size-2.5 shrink-0 rounded-full"
                  :style="{ backgroundColor: GEOFENCE_COLOR[g.type] }"
                />
                <div class="min-w-0">
                  <div class="truncate text-sm text-surface-100">{{ g.name }}</div>
                  <div class="text-xs uppercase text-surface-500">{{ g.type }}</div>
                </div>
              </div>
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                aria-label="Delete geofence"
                @click="geofences.remove(g.id)"
              />
            </li>
          </ul>
        </div>
      </aside>

      <div class="min-h-0 min-w-0 flex-1">
        <LMap
          :center="DEFAULT_MAP_CENTER"
          :zoom="DEFAULT_MAP_ZOOM"
          :use-global-leaflet="true"
          class="size-full"
          @ready="onMapReady"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
            attribution="&copy; OpenStreetMap contributors"
          />
          <GeofencePolygon
            v-for="g in list"
            :key="g.id"
            :geofence="g"
          />
        </LMap>
      </div>
    </main>

    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="New geofence"
      :style="{ width: '24rem' }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="gf-name" class="text-sm text-surface-300">Name</label>
          <InputText id="gf-name" v-model="draftName" autofocus fluid />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-sm text-surface-300">Type</span>
          <SelectButton
            v-model="draftType"
            :options="typeOptions"
            :allow-empty="false"
          >
            <template #option="{ option }">
              <span class="capitalize">{{ option }}</span>
            </template>
          </SelectButton>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="dialogVisible = false" />
        <Button
          label="Save"
          icon="pi pi-check"
          :loading="saving"
          :disabled="!draftName.trim()"
          @click="save"
        />
      </template>
    </Dialog>
  </div>
</template>
