<script setup lang="ts">
const { t } = useI18n();
import { useAuth } from "~/composables/useAuth";

definePageMeta({ layout: "auth", middleware: "guest" });

const { login, loading } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";

  try {
    await login(form);

    await navigateTo("/trips");
  } catch (error: any) {
    errorMessage.value = t('auth.loginError');
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h1 class="text-xl font-semibold">{{ t('auth.welcome') }}</h1>

        <p class="mt-1 text-sm text-muted">{{ t('auth.loginDescription') }}</p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
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

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :description="errorMessage"
      />

      <UButton type="submit" block :loading="loading">{{ t('auth.login') }}</UButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-muted">{{ t('auth.noAccount') }} <NuxtLink to="/register" class="text-primary hover:underline">{{ t('auth.register') }}</NuxtLink>
      </p>
    </template>
  </UCard>
</template>
