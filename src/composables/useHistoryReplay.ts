import { computed, ref } from 'vue'
import { getVehicleHistory } from '@/services/vehicles'
import type { HistoryPoint } from '@/types/api'
import type { LatLngTuple } from '@/utils/geo'

export type ReplaySpeed = 1 | 2 | 5

export function useHistoryReplay() {
  const points = ref<HistoryPoint[]>([])
  const times = ref<number[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const playing = ref(false)
  const multiplier = ref<ReplaySpeed>(1)
  const currentTime = ref(0)

  let rafId: number | null = null
  let lastFrame = 0

  const active = computed(() => points.value.length > 1)
  const fromTime = computed(() => times.value[0] ?? 0)
  const toTime = computed(() => times.value[times.value.length - 1] ?? 0)
  const span = computed(() => Math.max(0, toTime.value - fromTime.value))

  const progress = computed(() =>
    span.value === 0 ? 0 : (currentTime.value - fromTime.value) / span.value,
  )

  // Linear interpolation of position between the two samples bracketing
  // currentTime, so the marker glides instead of hopping point to point.
  const replayPosition = computed<LatLngTuple | null>(() => {
    const pts = points.value
    if (pts.length === 0) return null
    const t = currentTime.value
    if (t <= fromTime.value) return [pts[0].lat, pts[0].lng]
    if (t >= toTime.value) {
      const last = pts[pts.length - 1]
      return [last.lat, last.lng]
    }
    let i = 0
    while (i < times.value.length - 1 && times.value[i + 1] <= t) i++
    const a = pts[i]
    const b = pts[i + 1] ?? a
    const segment = times.value[i + 1] - times.value[i] || 1
    const frac = (t - times.value[i]) / segment
    return [a.lat + (b.lat - a.lat) * frac, a.lng + (b.lng - a.lng) * frac]
  })

  // Breadcrumb trail: every sample up to currentTime.
  const trail = computed<LatLngTuple[]>(() => {
    const result: LatLngTuple[] = []
    for (let i = 0; i < points.value.length; i++) {
      if (times.value[i] > currentTime.value) break
      result.push([points.value[i].lat, points.value[i].lng])
    }
    return result
  })

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function tick(now: number) {
    const dt = now - lastFrame
    lastFrame = now
    currentTime.value = Math.min(
      toTime.value,
      currentTime.value + dt * multiplier.value,
    )
    if (currentTime.value >= toTime.value) {
      pause()
      return
    }
    rafId = requestAnimationFrame(tick)
  }

  function play() {
    if (!active.value) return
    if (currentTime.value >= toTime.value) currentTime.value = fromTime.value
    playing.value = true
    lastFrame = performance.now()
    stopLoop()
    rafId = requestAnimationFrame(tick)
  }

  function pause() {
    playing.value = false
    stopLoop()
  }

  function togglePlay() {
    playing.value ? pause() : play()
  }

  function seek(nextProgress: number) {
    const clamped = Math.min(1, Math.max(0, nextProgress))
    currentTime.value = fromTime.value + clamped * span.value
  }

  function setMultiplier(value: ReplaySpeed) {
    multiplier.value = value
  }

  async function load(vehicleId: string) {
    loading.value = true
    error.value = null
    pause()
    try {
      const data = await getVehicleHistory(vehicleId)
      points.value = data
      times.value = data.map((p) => Date.parse(p.timestamp))
      currentTime.value = fromTime.value
    } catch {
      error.value = 'Failed to load history.'
      points.value = []
      times.value = []
    } finally {
      loading.value = false
    }
  }

  function clear() {
    pause()
    points.value = []
    times.value = []
    currentTime.value = 0
  }

  return {
    points,
    loading,
    error,
    playing,
    multiplier,
    currentTime,
    active,
    fromTime,
    toTime,
    progress,
    replayPosition,
    trail,
    load,
    clear,
    play,
    pause,
    togglePlay,
    seek,
    setMultiplier,
  }
}
