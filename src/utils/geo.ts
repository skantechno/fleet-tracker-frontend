import type { VehicleStatus } from '@/types/api'

export type LatLngTuple = [number, number]

export const DEFAULT_MAP_CENTER: LatLngTuple = [
  Number(import.meta.env.VITE_MAP_CENTER_LAT ?? 25.397),
  Number(import.meta.env.VITE_MAP_CENTER_LNG ?? 68.367),
]

export const DEFAULT_MAP_ZOOM = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM ?? 12)

// Tailwind palette hex values, keyed by vehicle status, for Leaflet divIcons
// (Leaflet markers render outside Vue's scoped styles, so we use inline color).
export const STATUS_COLOR: Record<VehicleStatus, string> = {
  active: '#34d399', // emerald-400
  idle: '#fbbf24', // amber-400
  offline: '#9ca3af', // gray-400
  maintenance: '#60a5fa', // blue-400
}

export const STATUS_LABEL: Record<VehicleStatus, string> = {
  active: 'Active',
  idle: 'Idle',
  offline: 'Offline',
  maintenance: 'Maintenance',
}
