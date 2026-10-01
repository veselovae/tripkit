<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);
const toast = useToast();

const { updateTrip, deleteTrip } = useTrips();

const { data: trip, status: tripStatus, error: tripError, refresh: refreshTrip } =
  await useLazyFetch<Trip>(`/api/trips/${tripId}`);

const form = reactive({
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
});

watch(trip, (value) => {
  if (!value) return;
  form.title = value.title;
  form.destination = value.destination;
  form.startDate = value.startDate;
  form.endDate = value.endDate;
  form.description = value.description;
}, { immediate: true });

const loading = computed(() => !trip.value && (tripStatus.value === "idle" || tripStatus.value === "pending"));
const loadError = computed(() => !trip.value && tripError.value);
const retryLoad = () => refreshTrip();

const saving = ref(false);
const deleting = ref(false);
const deleteDialogOpen = ref(false);

const save = async () => {
  saving.value = true;

  try {
    await updateTrip(tripId, form);

    toast.add({ title: "Trip updated", icon: "i-lucide-circle-check" });
  } catch {
    toast.add({
      title: "Could not update trip",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    saving.value = false;
  }
};

const confirmDeleteTrip = async () => {
  deleting.value = true;

  try {
    await deleteTrip(tripId);

    toast.add({ title: "Trip deleted", icon: "i-lucide-trash-2" });

    await navigateTo("/trips");
  } catch {
    toast.add({
      title: "Could not delete trip",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <TripPageSkeleton v-if="loading" form />
    <AppErrorState
      v-else-if="loadError"
      title="Could not load trip settings"
      @retry="retryLoad"
    />
    <template v-else-if="trip">
      <UButton
        :to="`/trips/${tripId}`"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="mb-6"
      >
        Back to trip
      </UButton>

      <div class="mb-6">
        <h1 class="text-3xl font-semibold">Trip settings</h1>

        <p class="mt-1 text-muted">Update your trip information.</p>
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
            @click="deleteDialogOpen = true"
          >
            Delete trip
          </UButton>
        </div>
      </UCard>
    </template>
  </div>

  <ConfirmDialog
    v-model:open="deleteDialogOpen"
    title="Delete trip?"
    :description="`Delete &quot;${trip?.title ?? 'this trip'}&quot; permanently?`"
    confirm-label="Delete trip"
    :loading="deleting"
    @confirm="confirmDeleteTrip"
  />
</template>
