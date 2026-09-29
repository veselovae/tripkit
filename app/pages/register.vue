<script setup lang="ts">
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
    errorMessage.value = "Passwords do not match";
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
      error?.data?.statusMessage ?? "Could not create account";
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h1 class="text-xl font-semibold">Create an account</h1>

        <p class="mt-1 text-sm text-muted">Start planning your next trip.</p>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UFormField label="Name">
        <UInput v-model="form.name" placeholder="Jane" class="w-full" />
      </UFormField>

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

      <UFormField label="Confirm password">
        <UInput v-model="form.confirmPassword" type="password" class="w-full" />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :description="errorMessage"
      />

      <UButton type="submit" block :loading="loading"> Create account </UButton>
    </form>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Already have an account?

        <NuxtLink to="/login" class="text-primary hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>
