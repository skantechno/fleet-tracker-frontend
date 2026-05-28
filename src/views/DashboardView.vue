<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import FleetMap from '@/components/map/FleetMap.vue'
import { useVehiclesStore } from '@/stores/vehicles'

const vehicles = useVehiclesStore()
const { positioned, loading, error } = storeToRefs(vehicles)

onMounted(() => {
  vehicles.fetchAll()
})
</script>

<template>
  <div class="flex h-screen flex-col bg-surface-950">
    <AppHeader />
    <main class="relative min-h-0 flex-1">
      <FleetMap :vehicles="positioned" />

      <div
        v-if="loading"
        class="absolute left-1/2 top-4 z-1000 -translate-x-1/2 rounded-full bg-surface-900/90 px-4 py-1.5 text-sm text-surface-300 shadow"
      >
        Loading fleet…
      </div>
      <div
        v-else-if="error"
        class="absolute left-1/2 top-4 z-1000 -translate-x-1/2 rounded-full bg-red-900/90 px-4 py-1.5 text-sm text-red-100 shadow"
      >
        {{ error }}
      </div>
    </main>
  </div>
</template>
