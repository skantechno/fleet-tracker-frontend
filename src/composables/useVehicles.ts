import { getSocket } from '@/services/socket'
import { useVehiclesStore } from '@/stores/vehicles'
import type { VehicleUpdatePayload } from '@/types/socket-events'

// Binds live vehicle:update events to the vehicles store. Returns an unbind
// function so callers can detach the listener on unmount.
export function useVehicles(): () => void {
  const vehicles = useVehiclesStore()
  const socket = getSocket()

  if (!socket) {
    return () => {}
  }

  const onUpdate = (payload: VehicleUpdatePayload): void => {
    vehicles.upsert({
      id: payload.vehicleId,
      status: payload.status,
      lastLat: payload.lat,
      lastLng: payload.lng,
      lastSpeed: payload.speed,
      lastFuel: payload.fuel,
      lastUpdate: payload.timestamp,
    })
  }

  socket.on('vehicle:update', onUpdate)

  return () => {
    socket.off('vehicle:update', onUpdate)
  }
}
