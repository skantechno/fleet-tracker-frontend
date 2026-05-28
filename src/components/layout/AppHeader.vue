<script setup lang="ts">
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ConnectionBadge from '@/components/layout/ConnectionBadge.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { user, isAdmin } = storeToRefs(auth)
const router = useRouter()
const route = useRoute()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class="flex items-center justify-between gap-4 border-b border-surface-800 bg-surface-900 px-6 py-3"
  >
    <div class="flex items-center gap-6">
      <RouterLink to="/" class="flex items-center gap-2 text-surface-0">
        <i class="pi pi-truck text-xl text-primary-400" />
        <span class="text-lg font-semibold">Fleet Tracker</span>
      </RouterLink>

      <nav class="flex items-center gap-1 text-sm">
        <RouterLink
          to="/"
          class="rounded-md px-3 py-1.5 text-surface-300 hover:bg-surface-800"
          :class="{ 'bg-surface-800 text-surface-0': route.path === '/' }"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          v-if="isAdmin"
          to="/geofences"
          class="rounded-md px-3 py-1.5 text-surface-300 hover:bg-surface-800"
          :class="{ 'bg-surface-800 text-surface-0': route.path === '/geofences' }"
        >
          Geofences
        </RouterLink>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <slot name="connection">
        <ConnectionBadge />
      </slot>

      <div v-if="user" class="flex items-center gap-3">
        <div class="text-right leading-tight">
          <div class="text-sm text-surface-100">{{ user.email }}</div>
          <div class="text-xs capitalize text-surface-400">{{ user.role }}</div>
        </div>
        <Button
          icon="pi pi-sign-out"
          severity="secondary"
          text
          rounded
          aria-label="Log out"
          title="Log out"
          @click="logout"
        />
      </div>
    </div>
  </header>
</template>
