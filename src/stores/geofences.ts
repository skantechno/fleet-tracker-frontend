import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createGeofence,
  deleteGeofence,
  getGeofences,
  type NewGeofence,
} from '@/services/geofences'
import type { Geofence } from '@/types/api'

export const useGeofencesStore = defineStore('geofences', () => {
  const list = ref<Geofence[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      list.value = await getGeofences()
    } catch {
      error.value = 'Failed to load geofences.'
    } finally {
      loading.value = false
    }
  }

  async function create(payload: NewGeofence): Promise<void> {
    const created = await createGeofence(payload)
    list.value.push(created)
  }

  async function remove(id: string): Promise<void> {
    await deleteGeofence(id)
    list.value = list.value.filter((g) => g.id !== id)
  }

  return { list, loading, error, fetchAll, create, remove }
})
