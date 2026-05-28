<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'

const clicks = ref(0)
</script>

<template>
  <main
    class="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-950 px-6 text-center"
  >
    <div class="flex flex-col items-center gap-2">
      <i class="pi pi-truck text-5xl text-primary-400" />
      <h1 class="text-4xl font-bold tracking-tight text-surface-0">
        Fleet Tracker
      </h1>
      <p class="text-surface-400">
        Real-time IoT fleet tracking dashboard
      </p>
    </div>

    <Button
      :label="clicks === 0 ? 'Click me' : `Clicked ${clicks}×`"
      icon="pi pi-bolt"
      @click="clicks++"
    />
  </main>
</template>
