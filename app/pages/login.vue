<script setup lang="ts">
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
    errorMessage.value = error?.data?.statusMessage ?? "Could not sign in";
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h1 class="text-xl font-semibold">Welcome back</h1>

        <p class="mt-1 text-sm text-muted">Sign in to continue to TripKit.</p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UFormField label="Email">
        <UInput
          v-model="form.email"
          type="email"
          placeholder="jane@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password">
        <UInput v-model="form.password" type="password" class="w-full" />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :description="errorMessage"
      />

      <UButton type="submit" block :loading="loading"> Sign in </UButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Don't have an account?

        <NuxtLink to="/register" class="text-primary hover:underline">
          Create one
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>
