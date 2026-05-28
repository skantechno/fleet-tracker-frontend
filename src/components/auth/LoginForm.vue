<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useAuthStore } from '@/stores/auth'
import type { ApiErrorBody } from '@/types/api'

const emit = defineEmits<{ success: [] }>()

const auth = useAuthStore()

const emailSchema = z.string().min(1, 'Email is required').email('Enter a valid email')
const passwordSchema = z.string().min(1, 'Password is required')

function zodValidator(schema: z.ZodTypeAny) {
  return (value: unknown): true | string => {
    const result = schema.safeParse(value)
    return result.success ? true : (result.error.issues[0]?.message ?? 'Invalid value')
  }
}

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: {
    email: zodValidator(emailSchema),
    password: zodValidator(passwordSchema),
  },
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const formError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  formError.value = null
  try {
    await auth.login(values.email, values.password)
    emit('success')
  } catch (err) {
    if (isAxiosError<ApiErrorBody>(err) && err.response?.data?.error) {
      formError.value = err.response.data.error.message
    } else {
      formError.value = 'Unable to sign in. Please try again.'
    }
  }
})
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <label for="email" class="text-sm font-medium text-surface-300">Email</label>
      <InputText
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="admin@demo.com"
        :invalid="!!emailError"
        fluid
      />
      <small v-if="emailError" class="text-red-400">{{ emailError }}</small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="text-sm font-medium text-surface-300">Password</label>
      <InputText
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="••••••••"
        :invalid="!!passwordError"
        fluid
      />
      <small v-if="passwordError" class="text-red-400">{{ passwordError }}</small>
    </div>

    <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>

    <Button
      type="submit"
      label="Sign in"
      icon="pi pi-sign-in"
      :loading="isSubmitting"
      fluid
    />
  </form>
</template>
