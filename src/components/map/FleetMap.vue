<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import {
  LMap,
  LTileLayer,
  LPolyline,
  LCircleMarker,
} from '@vue-leaflet/vue-leaflet'
import VehicleMarker from '@/components/map/VehicleMarker.vue'
import type { Vehicle } from '@/types/api'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  type LatLngTuple,
} from '@/utils/geo'

withDefaults(
  defineProps<{
    vehicles: Vehicle[]
    trail?: LatLngTuple[]
    replayPosition?: LatLngTuple | null
  }>(),
  { trail: () => [], replayPosition: null },
)

const emit = defineEmits<{
  select: [vehicle: Vehicle]
  deselect: []
}>()
</script>

<template>
  <div class="size-full">
    <LMap
      :center="DEFAULT_MAP_CENTER"
      :zoom="DEFAULT_MAP_ZOOM"
      :use-global-leaflet="false"
      class="size-full"
      @click="emit('deselect')"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="&copy; OpenStreetMap contributors"
      />
      <VehicleMarker
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
        @select="emit('select', $event)"
      />

      <LPolyline
        v-if="trail.length > 1"
        :lat-lngs="trail"
        color="#60a5fa"
        :weight="3"
        :opacity="0.7"
      />
      <LCircleMarker
        v-if="replayPosition"
        :lat-lng="replayPosition"
        :radius="8"
        color="#ffffff"
        :weight="2"
        fill-color="#60a5fa"
        :fill-opacity="1"
      />
    </LMap>
  </div>
</template>
