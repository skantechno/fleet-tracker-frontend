<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AlertItem from '@/components/alerts/AlertItem.vue'
import { useAlertsStore } from '@/stores/alerts'
import type { Alert } from '@/types/api'

const emit = defineEmits<{ select: [alert: Alert] }>()

const alerts = useAlertsStore()
const { list, loading } = storeToRefs(alerts)
</script>

<template>
  <div
    class="flex max-h-96 w-80 flex-col overflow-hidden rounded-lg border border-surface-700 bg-surface-900 shadow-xl"
  >
    <header
      class="flex items-center justify-between border-b border-surface-800 px-3 py-2"
    >
      <span class="text-sm font-semibold text-surface-100">Alerts</span>
      <span class="text-xs text-surface-500">{{ list.length }} recent</span>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div v-if="loading" class="px-3 py-6 text-center text-sm text-surface-500">
        Loading…
      </div>
      <div
        v-else-if="list.length === 0"
        class="px-3 py-6 text-center text-sm text-surface-500"
      >
        No alerts in the last 24h
      </div>
      <AlertItem
        v-for="alert in list"
        v-else
        :key="alert.id"
        :alert="alert"
        @select="emit('select', $event)"
        @acknowledge="alerts.acknowledge"
      />
    </div>
  </div>
</template>
