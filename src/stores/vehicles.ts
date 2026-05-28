import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getVehicles } from '@/services/vehicles'
import type { Vehicle } from '@/types/api'

export interface SpeedSample {
  t: number
  speed: number
}

const SPEED_WINDOW_MS = 5 * 60 * 1000

export const useVehiclesStore = defineStore('vehicles', () => {
  const byId = ref<Record<string, Vehicle>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedId = ref<string | null>(null)
  const speedHistory = ref<Record<string, SpeedSample[]>>({})

  const list = computed(() =>
    Object.values(byId.value).sort((a, b) => a.id.localeCompare(b.id)),
  )

  // Vehicles that have reported a position (lat/lng non-null) and can be mapped.
  const positioned = computed(() =>
    list.value.filter((v) => v.lastLat !== null && v.lastLng !== null),
  )

  const selected = computed<Vehicle | null>(() =>
    selectedId.value ? (byId.value[selectedId.value] ?? null) : null,
  )

  const selectedSpeedHistory = computed<SpeedSample[]>(() =>
    selectedId.value ? (speedHistory.value[selectedId.value] ?? []) : [],
  )

  function select(id: string): void {
    selectedId.value = id
  }

  function deselect(): void {
    selectedId.value = null
  }

  function recordSpeed(id: string, speed: number, at: number): void {
    const samples = speedHistory.value[id] ?? []
    samples.push({ t: at, speed })
    const cutoff = at - SPEED_WINDOW_MS
    speedHistory.value[id] = samples.filter((s) => s.t >= cutoff)
  }

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
    if (typeof update.lastSpeed === 'number') {
      const at = update.lastUpdate ? Date.parse(update.lastUpdate) : Date.now()
      recordSpeed(update.id, update.lastSpeed, Number.isNaN(at) ? Date.now() : at)
    }
  }

  return {
    byId,
    loading,
    error,
    selectedId,
    list,
    positioned,
    selected,
    selectedSpeedHistory,
    fetchAll,
    upsert,
    select,
    deselect,
  }
})
