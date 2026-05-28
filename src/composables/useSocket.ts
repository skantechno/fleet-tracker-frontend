import { storeToRefs } from 'pinia'
import * as socketService from '@/services/socket'
import { useConnectionStore } from '@/stores/connection'

export function useSocket() {
  const connection = useConnectionStore()
  const { health, socket: socketStatus } = storeToRefs(connection)

  function connect(token: string): socketService.FleetSocket {
    connection.setSocketStatus('connecting')
    const socket = socketService.connect(token)

    socket.on('connect', () => connection.setSocketStatus('connected'))
    socket.on('disconnect', () => connection.setSocketStatus('disconnected'))
    socket.on('connect_error', () => connection.setSocketStatus('disconnected'))
    socket.io.on('reconnect_attempt', () =>
      connection.setSocketStatus('connecting'),
    )
    socket.on('connection:status', (payload) =>
      connection.setServiceStatus(payload),
    )

    return socket
  }

  function disconnect(): void {
    socketService.disconnect()
    connection.setSocketStatus('disconnected')
  }

  function subscribeVehicle(vehicleId: string): void {
    socketService.getSocket()?.emit('subscribe:vehicle', { vehicleId })
  }

  function unsubscribeVehicle(vehicleId: string): void {
    socketService.getSocket()?.emit('unsubscribe:vehicle', { vehicleId })
  }

  return {
    health,
    socketStatus,
    connect,
    disconnect,
    subscribeVehicle,
    unsubscribeVehicle,
  }
}
