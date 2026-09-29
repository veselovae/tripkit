<script setup lang="ts">
import { useTrips } from "~/composables/useTrips";

definePageMeta({ middleware: "auth" });

const { createTrip } = useTrips();

const form = reactive({
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const trip = await createTrip(form);

    await navigateTo(`/trips/${trip.id}`);
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage ?? "Could not create trip";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <UButton
      to="/trips"
      icon="i-lucide-arrow-left"
      label="Back to trips"
      color="neutral"
      variant="ghost"
      class="mb-6"
    />

    <div class="mb-8">
      <h1 class="text-2xl font-semibold">Create trip</h1>

      <p class="mt-1 text-sm text-muted">
        Add the basic details of your journey.
      </p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Trip name" required>
          <UInput
            v-model="form.title"
            placeholder="Japan 2027"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Destination" required>
          <UInput
            v-model="form.destination"
            placeholder="Tokyo, Japan"
            class="w-full"
          />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Start date" required>
            <UInput v-model="form.startDate" type="date" class="w-full" />
          </UFormField>

          <UFormField label="End date" required>
            <UInput v-model="form.endDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Optional notes about this trip..."
            :rows="5"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :description="errorMessage"
        />

        <div class="flex justify-end gap-3">
          <UButton to="/trips" color="neutral" variant="ghost">
            Cancel
          </UButton>

          <UButton type="submit" icon="i-lucide-plus" :loading="loading">
            Create trip
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
