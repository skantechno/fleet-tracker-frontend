import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getVehicles } from '@/services/vehicles'
import type { Vehicle } from '@/types/api'

export const useVehiclesStore = defineStore('vehicles', () => {
  const byId = ref<Record<string, Vehicle>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const list = computed(() =>
    Object.values(byId.value).sort((a, b) => a.id.localeCompare(b.id)),
  )

  // Vehicles that have reported a position (lat/lng non-null) and can be mapped.
  const positioned = computed(() =>
    list.value.filter((v) => v.lastLat !== null && v.lastLng !== null),
  )

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const vehicles = await getVehicles()
      byId.value = Object.fromEntries(vehicles.map((v) => [v.id, v]))
    } catch {
      error.value = 'Failed to load vehicles.'
    } finally {
      loading.value = false
    }
  }

  // Merge a partial telemetry/status update into an existing vehicle (Phase 5).
  function upsert(update: Partial<Vehicle> & { id: string }): void {
    const existing = byId.value[update.id]
    if (existing) {
      byId.value[update.id] = { ...existing, ...update }
    } else {
      byId.value[update.id] = update as Vehicle
    }
  }

  return { byId, loading, error, list, positioned, fetchAll, upsert }
})
