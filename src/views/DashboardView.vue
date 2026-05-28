<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import FleetMap from '@/components/map/FleetMap.vue'
import type { Vehicle } from '@/types/api'

// Placeholder fleet until Phase 4 wires the backend. Spread around Hyderabad.
const vehicles: Vehicle[] = [
  { id: 'v-001', name: 'Truck 01', status: 'active', lastLat: 25.41, lastLng: 68.37, lastSpeed: 52, lastFuel: 78, lastUpdate: new Date().toISOString() },
  { id: 'v-002', name: 'Truck 02', status: 'idle', lastLat: 25.39, lastLng: 68.39, lastSpeed: 0, lastFuel: 45, lastUpdate: new Date().toISOString() },
  { id: 'v-003', name: 'Truck 03', status: 'offline', lastLat: 25.37, lastLng: 68.35, lastSpeed: 0, lastFuel: 12, lastUpdate: new Date().toISOString() },
  { id: 'v-004', name: 'Truck 04', status: 'maintenance', lastLat: 25.40, lastLng: 68.34, lastSpeed: 0, lastFuel: 90, lastUpdate: new Date().toISOString() },
  { id: 'v-005', name: 'Truck 05', status: 'active', lastLat: 25.38, lastLng: 68.40, lastSpeed: 37, lastFuel: 63, lastUpdate: new Date().toISOString() },
]
</script>

<template>
  <div class="flex h-screen flex-col bg-surface-950">
    <AppHeader />
    <main class="min-h-0 flex-1">
      <FleetMap :vehicles="vehicles" />
    </main>
  </div>
</template>
