import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { acknowledgeAlert, getAlerts } from '@/services/alerts'
import type { Alert } from '@/types/api'
import type { AlertNewPayload } from '@/types/socket-events'

export const useAlertsStore = defineStore('alerts', () => {
  const list = ref<Alert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Most recent realtime alert, consumed by the toast component.
  const latest = ref<Alert | null>(null)

  const unacknowledgedCount = computed(
    () => list.value.filter((a) => !a.acknowledged).length,
  )

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { alerts } = await getAlerts(1, 50)
      list.value = alerts
    } catch {
      error.value = 'Failed to load alerts.'
    } finally {
      loading.value = false
    }
  }

  function addRealtime(payload: AlertNewPayload): void {
    const alert: Alert = { ...payload, acknowledged: false }
    list.value.unshift(alert)
    latest.value = alert
  }

  async function acknowledge(id: string): Promise<void> {
    const alert = list.value.find((a) => a.id === id)
    if (!alert || alert.acknowledged) return
    alert.acknowledged = true // optimistic
    try {
      await acknowledgeAlert(id)
    } catch {
      alert.acknowledged = false // roll back on failure
      error.value = 'Failed to acknowledge alert.'
    }
  }

  return {
    list,
    loading,
    error,
    latest,
    unacknowledgedCount,
    fetchAll,
    addRealtime,
    acknowledge,
  }
})
