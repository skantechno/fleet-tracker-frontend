import api from '@/services/api'
import type { ApiSuccess, LoginResponse, User } from '@/types/api'

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<ApiSuccess<LoginResponse>>('/auth/login', {
    email,
    password,
  })
  return data.data
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>('/auth/me')
  return data.data
}
