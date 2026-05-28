import api from '@/services/api'
import type { ApiSuccess, Vehicle } from '@/types/api'

export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get<ApiSuccess<Vehicle[]>>('/vehicles')
  return data.data
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data } = await api.get<ApiSuccess<Vehicle>>(`/vehicles/${id}`)
  return data.data
}
