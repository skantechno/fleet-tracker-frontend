import api from '@/services/api'
import type { ApiSuccess, Geofence, GeofenceType } from '@/types/api'

export interface NewGeofence {
  name: string
  type: GeofenceType
  coordinates: [number, number][]
}

export async function getGeofences(): Promise<Geofence[]> {
  const { data } = await api.get<ApiSuccess<Geofence[]>>('/geofences')
  return data.data
}

export async function createGeofence(payload: NewGeofence): Promise<Geofence> {
  const { data } = await api.post<ApiSuccess<Geofence>>('/geofences', payload)
  return data.data
}

export async function deleteGeofence(id: string): Promise<void> {
  await api.delete(`/geofences/${id}`)
}
