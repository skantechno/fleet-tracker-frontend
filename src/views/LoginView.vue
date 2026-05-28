<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()

function onSuccess() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.replace(redirect)
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-surface-950 px-4">
    <div
      class="w-full max-w-sm rounded-xl border border-surface-800 bg-surface-900 p-8 shadow-xl"
    >
      <div class="mb-8 flex flex-col items-center gap-2 text-center">
        <i class="pi pi-truck text-4xl text-primary-400" />
        <h1 class="text-2xl font-bold text-surface-0">Fleet Tracker</h1>
        <p class="text-sm text-surface-400">Sign in to your dashboard</p>
      </div>

      <LoginForm @success="onSuccess" />
    </div>
  </main>
</template>
