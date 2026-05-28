<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface-950">
    <AppHeader />
    <main class="flex flex-1 items-center justify-center p-6 text-center">
      <div class="flex flex-col items-center gap-2 text-surface-400">
        <i class="pi pi-map text-4xl text-surface-600" />
        <p>Fleet map arrives in Phase 3.</p>
      </div>
    </main>
  </div>
</template>
