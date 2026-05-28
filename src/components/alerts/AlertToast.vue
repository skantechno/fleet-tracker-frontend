<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useAlertsStore } from '@/stores/alerts'
import { ALERT_TYPE_LABEL, TOAST_SEVERITY } from '@/utils/format'

const toast = useToast()
const alerts = useAlertsStore()
const { latest } = storeToRefs(alerts)

watch(latest, (alert) => {
  if (!alert) return
  toast.add({
    severity: TOAST_SEVERITY[alert.severity],
    summary: `${ALERT_TYPE_LABEL[alert.type]} · ${alert.vehicleId}`,
    detail: alert.message,
    life: 5000,
  })
})
</script>

<template>
  <Toast position="top-right" />
</template>
