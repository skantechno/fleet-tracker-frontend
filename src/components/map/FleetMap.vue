<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import VehicleMarker from '@/components/map/VehicleMarker.vue'
import type { Vehicle } from '@/types/api'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/utils/geo'

defineProps<{ vehicles: Vehicle[] }>()

const emit = defineEmits<{ select: [vehicle: Vehicle] }>()
</script>

<template>
  <div class="size-full">
    <LMap
      :center="DEFAULT_MAP_CENTER"
      :zoom="DEFAULT_MAP_ZOOM"
      :use-global-leaflet="false"
      class="size-full"
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
    </LMap>
  </div>
</template>
