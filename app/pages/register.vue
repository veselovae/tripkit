<script setup lang="ts">
const { t } = useI18n();
import { useAuth } from "~/composables/useAuth";

definePageMeta({ layout: "auth", middleware: "guest" });

const { register, loading } = useAuth();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";

  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.passwordMismatch');
    return;
  }

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    await navigateTo("/trips");
  } catch (error: any) {
    errorMessage.value =
      t('auth.registerError');
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h1 class="text-xl font-semibold">{{ t('auth.register') }}</h1>

        <p class="mt-1 text-sm text-muted">{{ t('auth.registerDescription') }}</p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UFormField :label="t('auth.name')">
        <UInput v-model="form.name" :placeholder="t('auth.namePlaceholder')" class="w-full" />
      </UFormField>

      <UFormField :label="t('auth.email')">
        <UInput
          v-model="form.email"
          type="email"
          placeholder="jane@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('auth.password')">
        <UInput v-model="form.password" type="password" class="w-full" />
      </UFormField>

      <UFormField :label="t('auth.confirmPassword')">
        <UInput v-model="form.confirmPassword" type="password" class="w-full" />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :description="errorMessage"
      />

      <UButton type="submit" block :loading="loading">{{ t('auth.register') }}</UButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-muted">{{ t('auth.alreadyHaveAccount') }} <NuxtLink to="/login" class="text-primary hover:underline">{{ t('auth.login') }}</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
