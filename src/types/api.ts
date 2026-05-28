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
