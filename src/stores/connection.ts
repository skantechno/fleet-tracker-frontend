import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ServiceStatus } from '@/types/socket-events'

export type SocketStatus = 'connected' | 'connecting' | 'disconnected'

export const useConnectionStore = defineStore('connection', () => {
  const socket = ref<SocketStatus>('disconnected')
  const mqtt = ref<ServiceStatus>('disconnected')
  const influx = ref<ServiceStatus>('disconnected')

  // green = fully live, amber = socket up but a backend service is down or
  // still connecting, red = no socket connection.
  const health = computed<'green' | 'amber' | 'red'>(() => {
    if (socket.value !== 'connected') {
      return socket.value === 'connecting' ? 'amber' : 'red'
    }
    return mqtt.value === 'connected' && influx.value === 'connected'
      ? 'green'
      : 'amber'
  })

  function setSocketStatus(status: SocketStatus): void {
    socket.value = status
    if (status !== 'connected') {
      mqtt.value = 'disconnected'
      influx.value = 'disconnected'
    }
  }

  function setServiceStatus(next: {
    mqtt: ServiceStatus
    influx: ServiceStatus
  }): void {
    mqtt.value = next.mqtt
    influx.value = next.influx
  }

  return { socket, mqtt, influx, health, setSocketStatus, setServiceStatus }
})
