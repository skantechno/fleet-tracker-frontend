<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import Button from 'primevue/button'
import type { Alert } from '@/types/api'
import { ALERT_TYPE_LABEL, SEVERITY_CLASS } from '@/utils/format'

const props = defineProps<{ alert: Alert }>()

const emit = defineEmits<{ select: [alert: Alert]; acknowledge: [id: string] }>()

const severity = computed(() => SEVERITY_CLASS[props.alert.severity])
const typeLabel = computed(() => ALERT_TYPE_LABEL[props.alert.type])
const when = computed(() =>
  formatDistanceToNow(new Date(props.alert.timestamp), { addSuffix: true }),
)
</script>

<template>
  <div
    class="flex items-start gap-3 border-l-2 px-3 py-2.5 hover:bg-surface-800"
    :class="[severity.border, alert.acknowledged ? 'opacity-50' : '']"
  >
    <button
      type="button"
      class="min-w-0 flex-1 text-left"
      @click="emit('select', alert)"
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" :class="severity.dot" />
        <span class="text-sm font-medium text-surface-100">{{ typeLabel }}</span>
        <span class="text-xs text-surface-500">{{ alert.vehicleId }}</span>
      </div>
      <p class="mt-0.5 truncate text-xs text-surface-400">{{ alert.message }}</p>
      <span class="text-[10px] text-surface-500">{{ when }}</span>
    </button>

    <Button
      v-if="!alert.acknowledged"
      icon="pi pi-check"
      severity="secondary"
      text
      rounded
      size="small"
      aria-label="Acknowledge"
      title="Acknowledge"
      @click.stop="emit('acknowledge', alert.id)"
    />
  </div>
</template>
