<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import VehicleSpeedChart from '@/components/sidebar/VehicleSpeedChart.vue'
import type { Vehicle } from '@/types/api'
import type { SpeedSample } from '@/stores/vehicles'
import { STATUS_COLOR, STATUS_LABEL } from '@/utils/geo'

const props = defineProps<{ vehicle: Vehicle; samples: SpeedSample[] }>()

defineEmits<{ close: [] }>()

const statusColor = computed(() => STATUS_COLOR[props.vehicle.status])
const statusLabel = computed(() => STATUS_LABEL[props.vehicle.status])

const speed = computed(() => Math.round(props.vehicle.lastSpeed ?? 0))
const fuel = computed(() => Math.round(props.vehicle.lastFuel ?? 0))
const fuelClass = computed(() =>
  fuel.value <= 15
    ? 'text-red-400'
    : fuel.value <= 35
      ? 'text-amber-400'
      : 'text-surface-100',
)

const lastUpdate = computed(() =>
  props.vehicle.lastUpdate
    ? formatDistanceToNow(new Date(props.vehicle.lastUpdate), { addSuffix: true })
    : '—',
)
</script>

<template>
  <aside
    class="fixed inset-x-0 bottom-0 z-1000 flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto rounded-t-2xl border-t border-surface-800 bg-surface-900 p-5 text-surface-100 shadow-2xl md:static md:inset-auto md:max-h-none md:w-80 md:rounded-none md:border-l md:border-t-0 md:shadow-none"
  >
    <header class="flex items-start justify-between">
      <div>
        <h2 class="text-lg font-semibold">{{ vehicle.name }}</h2>
        <span class="inline-flex items-center gap-2 text-sm text-surface-400">
          <span
            class="size-2.5 rounded-full"
            :style="{ backgroundColor: statusColor }"
          />
          {{ statusLabel }}
        </span>
      </div>
      <Button
        icon="pi pi-times"
        severity="secondary"
        text
        rounded
        aria-label="Close"
        @click="$emit('close')"
      />
    </header>

    <div>
      <div class="text-xs uppercase tracking-wide text-surface-500">Speed</div>
      <div class="flex items-baseline gap-1">
        <span class="text-5xl font-bold tabular-nums">{{ speed }}</span>
        <span class="text-surface-400">km/h</span>
      </div>
      <VehicleSpeedChart :samples="samples" class="mt-2" />
    </div>

    <div>
      <div class="mb-1 flex items-center justify-between text-sm">
        <span class="text-xs uppercase tracking-wide text-surface-500">Fuel</span>
        <span class="font-semibold tabular-nums" :class="fuelClass">{{ fuel }}%</span>
      </div>
      <ProgressBar :value="fuel" :show-value="false" style="height: 0.5rem" />
    </div>

    <div class="mt-auto text-xs text-surface-500">
      Last update {{ lastUpdate }}
    </div>
  </aside>
</template>
