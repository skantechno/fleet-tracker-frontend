import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '@/services/auth'
import { getStoredToken, setStoredToken } from '@/services/api'
import type { User } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredToken())
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => token.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email: string, password: string): Promise<void> {
    const result = await authService.login(email, password)
    token.value = result.token
    user.value = result.user
    setStoredToken(result.token)
  }

  async function fetchMe(): Promise<void> {
    user.value = await authService.fetchMe()
  }

  function logout(): void {
    token.value = null
    user.value = null
    setStoredToken(null)
  }

  return { token, user, isAuthenticated, isAdmin, login, fetchMe, logout }
})
