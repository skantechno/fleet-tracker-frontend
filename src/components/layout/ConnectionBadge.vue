<script setup lang="ts">
// Placeholder until Phase 5 wires real Socket.io / MQTT status.
// Renders a neutral "offline" indicator for now.
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full border border-surface-700 bg-surface-800 px-3 py-1 text-xs font-medium text-surface-300"
    title="Realtime connection status"
  >
    <span class="size-2 rounded-full bg-surface-500" />
    Offline
  </span>
</template>
