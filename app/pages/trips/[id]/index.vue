<script setup lang="ts">
import type { TripOverview } from "~~/shared/types/tripOverview";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const tripId = String(route.params.id);

const {
  data: overview,
  error,
  refresh,
} = await useFetch<TripOverview>(`/api/trips/${tripId}/overview`);

if (error.value || !overview.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Trip not found",
  });
}

const trip = computed(() => overview.value!.trip);

const checklist = computed(() => overview.value!.checklist);

const nextTransport = computed(() => overview.value!.nextTransport);

const accommodation = computed(() => overview.value!.accommodation);

const formatTripDate = (value: string) => {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <UButton
      to="/trips"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="mb-6"
    >
      Trips
    </UButton>

    <div
      class="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
    >
      <div>
        <h1 class="text-3xl font-semibold">
          {{ trip.title }}
        </h1>

        <div class="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-muted">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-map-pin"
              class="size-4"
            />

            <span>
              {{ trip.destination }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-calendar-days"
              class="size-4"
            />

            <span>
              {{ formatTripDate(trip.startDate) }}
              —
              {{ formatTripDate(trip.endDate) }}
            </span>
          </div>
        </div>

        <p
          v-if="trip.description"
          class="mt-4 max-w-2xl text-sm leading-6 text-muted"
        >
          {{ trip.description }}
        </p>
      </div>

      <UButton
        :to="`/trips/${tripId}/settings`"
        icon="i-lucide-settings"
        color="neutral"
        variant="soft"
      >
        Trip settings
      </UButton>
    </div>

    <TripNavigation :trip-id="tripId" />

    <div class="grid gap-6 xl:grid-cols-2">
      <ChecklistProgressCard
        :trip-id="tripId"
        :total="checklist.total"
        :completed="checklist.completed"
        :progress="checklist.progress"
      />

      <QuickActionsCard :trip-id="tripId" />

      <NextTransportCard :trip-id="tripId" :transport="nextTransport" />

      <AccommodationSummaryCard
        :trip-id="tripId"
        :accommodation="accommodation"
      />
    </div>
  </div>
</template>
