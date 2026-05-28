import api from '@/services/api'
import type { ApiSuccess, HistoryPoint, Vehicle } from '@/types/api'

export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get<ApiSuccess<Vehicle[]>>('/vehicles')
  return data.data
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data } = await api.get<ApiSuccess<Vehicle>>(`/vehicles/${id}`)
  return data.data
}

export async function getVehicleHistory(
  id: string,
  from?: Date,
  to?: Date,
): Promise<HistoryPoint[]> {
  const params: Record<string, string> = {}
  if (from) params.from = from.toISOString()
  if (to) params.to = to.toISOString()
  const { data } = await api.get<ApiSuccess<HistoryPoint[]>>(
    `/vehicles/${id}/history`,
    { params },
  )
  return data.data
}
