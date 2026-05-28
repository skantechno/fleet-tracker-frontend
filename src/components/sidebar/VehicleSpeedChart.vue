<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { SpeedSample } from '@/stores/vehicles'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

const props = defineProps<{ samples: SpeedSample[] }>()

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.samples.map((s) => String(s.t)),
  datasets: [
    {
      data: props.samples.map((s) => s.speed),
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.15)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false, min: 0, suggestedMax: 100 },
  },
}
</script>

<template>
  <div class="h-16 w-full">
    <Line v-if="samples.length > 1" :data="chartData" :options="chartOptions" />
    <div
      v-else
      class="flex h-full items-center justify-center text-xs text-surface-500"
    >
      Collecting speed data…
    </div>
  </div>
</template>
