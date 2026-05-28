<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConnectionStore } from '@/stores/connection'

const connection = useConnectionStore()
const { health, socket, mqtt, influx } = storeToRefs(connection)

const dotClass = computed(
  () =>
    ({
      green: 'bg-emerald-400',
      amber: 'bg-amber-400',
      red: 'bg-red-500',
    })[health.value],
)

const label = computed(
  () =>
    ({
      green: 'Live',
      amber: socket.value === 'connecting' ? 'Connecting' : 'Degraded',
      red: 'Offline',
    })[health.value],
)

const title = computed(
  () => `socket: ${socket.value} · mqtt: ${mqtt.value} · influx: ${influx.value}`,
)
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full border border-surface-700 bg-surface-800 px-3 py-1 text-xs font-medium text-surface-300"
    :title="title"
  >
    <span
      class="size-2 rounded-full"
      :class="[dotClass, health === 'amber' ? 'animate-pulse' : '']"
    />
    {{ label }}
  </span>
</template>
