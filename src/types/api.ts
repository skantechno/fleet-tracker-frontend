// Types mirroring API_CONTRACT.md. Keep in sync with the backend.

export type UserRole = 'admin' | 'dispatcher'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  token: string
  user: User
}

export type AlertType =
  | 'speed_violation'
  | 'geofence_exit'
  | 'low_fuel'
  | 'offline'

export type AlertSeverity = 'low' | 'medium' | 'high'

export interface Alert {
  id: string
  vehicleId: string
  type: AlertType
  message: string
  severity: AlertSeverity
  timestamp: string
  acknowledged: boolean
}

export interface HistoryPoint {
  timestamp: string
  lat: number
  lng: number
  speed: number
  fuel: number
}

export type VehicleStatus = 'active' | 'idle' | 'offline' | 'maintenance'

export interface Vehicle {
  id: string
  name: string
  status: VehicleStatus
  // null until the first telemetry message arrives for the vehicle
  lastLat: number | null
  lastLng: number | null
  lastSpeed: number | null
  lastFuel: number | null
  lastUpdate: string
}

// --- Response envelope (API_CONTRACT.md §0) ---

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ResponseMeta {
  pagination?: PaginationMeta
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: ResponseMeta
}

export interface ApiErrorBody {
  success: false
  error: {
    message: string
    code: string
    details?: Record<string, unknown>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody
