<script setup lang="ts">
import { computed } from 'vue'
import { LPolygon, LTooltip } from '@vue-leaflet/vue-leaflet'
import type { Geofence } from '@/types/api'
import { GEOFENCE_COLOR } from '@/utils/geo'

const props = defineProps<{ geofence: Geofence }>()

const color = computed(() => GEOFENCE_COLOR[props.geofence.type])
</script>

<template>
  <LPolygon
    :lat-lngs="geofence.coordinates"
    :color="color"
    :weight="2"
    :fill-color="color"
    :fill-opacity="0.15"
  >
    <LTooltip>
      <div class="text-xs">
        <span class="font-semibold">{{ geofence.name }}</span>
        <span class="ml-1 uppercase text-surface-400">{{ geofence.type }}</span>
      </div>
    </LTooltip>
  </LPolygon>
</template>
