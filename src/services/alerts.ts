import api from '@/services/api'
import type { Alert, ApiSuccess, PaginationMeta } from '@/types/api'

export interface AlertsPage {
  alerts: Alert[]
  pagination?: PaginationMeta
}

export async function getAlerts(page = 1, limit = 50): Promise<AlertsPage> {
  const { data } = await api.get<ApiSuccess<Alert[]>>('/alerts', {
    params: { page, limit },
  })
  return { alerts: data.data, pagination: data.meta?.pagination }
}

export async function acknowledgeAlert(id: string): Promise<void> {
  await api.post<ApiSuccess<{ acknowledged: true }>>(`/alerts/${id}/acknowledge`)
}
