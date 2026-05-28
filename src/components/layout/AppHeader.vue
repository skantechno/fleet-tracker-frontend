<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import ConnectionBadge from '@/components/layout/ConnectionBadge.vue'
import AlertList from '@/components/alerts/AlertList.vue'
import { useAuthStore } from '@/stores/auth'
import { useAlertsStore } from '@/stores/alerts'
import type { Alert } from '@/types/api'

const emit = defineEmits<{ alertSelect: [alert: Alert] }>()

const auth = useAuthStore()
const { user, isAdmin } = storeToRefs(auth)
const alerts = useAlertsStore()
const { unacknowledgedCount } = storeToRefs(alerts)
const router = useRouter()
const route = useRoute()

const showAlerts = ref(false)

function onAlertSelect(alert: Alert) {
  showAlerts.value = false
  emit('alertSelect', alert)
}

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

      <div class="relative">
        <Button
          icon="pi pi-bell"
          severity="secondary"
          text
          rounded
          :badge="unacknowledgedCount > 0 ? String(unacknowledgedCount) : undefined"
          badge-severity="danger"
          aria-label="Alerts"
          title="Alerts"
          @click="showAlerts = !showAlerts"
        />
        <template v-if="showAlerts">
          <div class="fixed inset-0 z-1000" @click="showAlerts = false" />
          <div class="absolute right-0 top-full z-1000 mt-2">
            <AlertList @select="onAlertSelect" />
          </div>
        </template>
      </div>

      <div v-if="user" class="flex items-center gap-3">
        <div class="hidden text-right leading-tight sm:block">
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
