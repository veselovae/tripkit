<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const toast = useToast();

const { updateTrip, deleteTrip } = useTrips();

const { data: trip } = await useFetch<Trip>(`/api/trips/${route.params.id}`);

if (!trip.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Trip not found",
  });
}

const form = reactive({
  title: trip.value.title,
  destination: trip.value.destination,
  startDate: trip.value.startDate,
  endDate: trip.value.endDate,
  description: trip.value.description,
});

const saving = ref(false);
const deleting = ref(false);

const save = async () => {
  saving.value = true;

  try {
    await updateTrip(trip.value!.id, form);

    toast.add({ title: "Trip updated" });
  } finally {
    saving.value = false;
  }
};

const remove = async () => {
  if (!trip.value) return;

  const confirmed = window.confirm(`Delete "${trip.value.title}"?`);

  if (!confirmed) return;

  deleting.value = true;

  try {
    await deleteTrip(trip.value.id);

    await navigateTo("/trips");
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <UButton
      :to="`/trips/${trip?.id}`"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="mb-6"
    >
      Back to trip
    </UButton>

    <div class="mb-8">
      <h1 class="text-2xl font-semibold">Trip settings</h1>

      <p class="mt-1 text-sm text-muted">Update your trip information.</p>
    </div>

    <UCard>
      <form class="space-y-6" @submit.prevent="save">
        <UFormField label="Trip name">
          <UInput v-model="form.title" class="w-full" />
        </UFormField>

        <UFormField label="Destination">
          <UInput v-model="form.destination" class="w-full" />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Start date">
            <UInput v-model="form.startDate" type="date" class="w-full" />
          </UFormField>

          <UFormField label="End date">
            <UInput v-model="form.endDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Description">
          <UTextarea v-model="form.description" :rows="5" class="w-full" />
        </UFormField>

        <div class="flex justify-end">
          <UButton type="submit" icon="i-lucide-save" :loading="saving">
            Save changes
          </UButton>
        </div>
      </form>
    </UCard>

    <UCard class="mt-6">
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="font-medium">Delete trip</h2>

          <p class="mt-1 text-sm text-muted">This action cannot be undone.</p>
        </div>

        <UButton
          color="error"
          variant="soft"
          icon="i-lucide-trash-2"
          :loading="deleting"
          @click="remove"
        >
          Delete trip
        </UButton>
      </div>
    </UCard>
  </div>
</template>
