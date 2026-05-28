<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import Button from 'primevue/button'
import Slider from 'primevue/slider'
import SelectButton from 'primevue/selectbutton'
import type { ReplaySpeed } from '@/composables/useHistoryReplay'

const props = defineProps<{
  vehicleName: string
  loading: boolean
  playing: boolean
  multiplier: ReplaySpeed
  progress: number
  currentTime: number
  fromTime: number
  toTime: number
}>()

const emit = defineEmits<{
  seek: [progress: number]
  togglePlay: []
  setSpeed: [speed: ReplaySpeed]
  close: []
}>()

const speedOptions: ReplaySpeed[] = [1, 2, 5]

const sliderValue = computed<number>({
  get: () => Math.round(props.progress * 100),
  set: (value) => emit('seek', value / 100),
})

const clock = (t: number) => (t ? format(new Date(t), 'HH:mm:ss') : '--:--:--')
</script>

<template>
  <div
    class="flex items-center gap-4 border-t border-surface-800 bg-surface-900/95 px-5 py-3 text-surface-200 backdrop-blur"
  >
    <Button
      :icon="playing ? 'pi pi-pause' : 'pi pi-play'"
      rounded
      :disabled="loading"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="emit('togglePlay')"
    />

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <div class="flex items-center justify-between text-xs text-surface-400">
        <span class="truncate font-medium text-surface-200">
          {{ vehicleName }} · history (last hour)
        </span>
        <span class="tabular-nums">{{ clock(currentTime) }}</span>
      </div>
      <Slider
        :model-value="sliderValue"
        :min="0"
        :max="100"
        :disabled="loading"
        @update:model-value="(v) => (sliderValue = Array.isArray(v) ? v[0] : v)"
      />
      <div class="flex justify-between text-[10px] text-surface-500 tabular-nums">
        <span>{{ clock(fromTime) }}</span>
        <span>{{ clock(toTime) }}</span>
      </div>
    </div>

    <SelectButton
      :model-value="multiplier"
      :options="speedOptions"
      :allow-empty="false"
      @update:model-value="(v) => v && emit('setSpeed', v)"
    >
      <template #option="{ option }">{{ option }}×</template>
    </SelectButton>

    <Button
      icon="pi pi-times"
      severity="secondary"
      text
      rounded
      aria-label="Close replay"
      @click="emit('close')"
    />
  </div>
</template>
