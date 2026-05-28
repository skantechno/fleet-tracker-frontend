// Typed Socket.io events mirroring API_CONTRACT.md §3.
import type { VehicleStatus } from '@/types/api'

export type ServiceStatus = 'connected' | 'disconnected'

export interface VehicleUpdatePayload {
  vehicleId: string
  lat: number
  lng: number
  speed: number
  fuel: number
  status: VehicleStatus
  timestamp: string
}

export type AlertType =
  | 'speed_violation'
  | 'geofence_exit'
  | 'low_fuel'
  | 'offline'

export type AlertSeverity = 'low' | 'medium' | 'high'

export interface AlertNewPayload {
  id: string
  vehicleId: string
  type: AlertType
  message: string
  severity: AlertSeverity
  timestamp: string
}

export interface ConnectionStatusPayload {
  mqtt: ServiceStatus
  influx: ServiceStatus
}

export interface ServerToClientEvents {
  'vehicle:update': (payload: VehicleUpdatePayload) => void
  'alert:new': (payload: AlertNewPayload) => void
  'connection:status': (payload: ConnectionStatusPayload) => void
}

export interface ClientToServerEvents {
  'subscribe:vehicle': (payload: { vehicleId: string }) => void
  'unsubscribe:vehicle': (payload: { vehicleId: string }) => void
}
