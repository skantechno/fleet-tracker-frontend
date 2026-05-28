<script setup lang="ts">
import { computed } from 'vue'
import { LMarker, LIcon, LTooltip } from '@vue-leaflet/vue-leaflet'
import type { Vehicle } from '@/types/api'
import { STATUS_COLOR, STATUS_LABEL } from '@/utils/geo'

const props = defineProps<{ vehicle: Vehicle }>()

const emit = defineEmits<{ select: [vehicle: Vehicle] }>()

const color = computed(() => STATUS_COLOR[props.vehicle.status])
const statusLabel = computed(() => STATUS_LABEL[props.vehicle.status])

const latLng = computed<[number, number] | null>(() =>
  props.vehicle.lastLat !== null && props.vehicle.lastLng !== null
    ? [props.vehicle.lastLat, props.vehicle.lastLng]
    : null,
)
</script>

<template>
  <LMarker
    v-if="latLng"
    :lat-lng="latLng"
    @click="emit('select', vehicle)"
  >
    <LIcon :icon-size="[18, 18]" :icon-anchor="[9, 9]" class-name="vehicle-marker-icon">
      <span
        class="block size-[18px] rounded-full border-2 border-white shadow-md"
        :style="{ backgroundColor: color }"
      />
    </LIcon>
    <LTooltip :options="{ direction: 'top', offset: [0, -10] }">
      <div class="text-xs">
        <div class="font-semibold">{{ vehicle.name }}</div>
        <div>{{ statusLabel }} · {{ Math.round(vehicle.lastSpeed ?? 0) }} km/h</div>
      </div>
    </LTooltip>
  </LMarker>
</template>
