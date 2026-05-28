import { getSocket } from '@/services/socket'
import { useAlertsStore } from '@/stores/alerts'
import type { AlertNewPayload } from '@/types/socket-events'

// Binds live alert:new events to the alerts store. Returns an unbind function.
export function useAlerts(): () => void {
  const alerts = useAlertsStore()
  const socket = getSocket()

  if (!socket) {
    return () => {}
  }

  const onAlert = (payload: AlertNewPayload): void => {
    alerts.addRealtime(payload)
  }

  socket.on('alert:new', onAlert)

  return () => {
    socket.off('alert:new', onAlert)
  }
}
