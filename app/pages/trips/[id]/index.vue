<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();

const { data: trip, error } = await useFetch<Trip>(
  `/api/trips/${route.params.id}`,
);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Trip not found",
  });
}
</script>

<template>
  <div v-if="trip" class="mx-auto max-w-7xl">
    <UButton
      to="/trips"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="mb-6"
    >
      All trips
    </UButton>

    <div
      class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        <h1 class="text-3xl font-semibold">
          {{ trip.title }}
        </h1>

        <div class="mt-2 flex items-center gap-2 text-muted">
          <UIcon name="i-lucide-map-pin" class="size-4" />

          {{ trip.destination }}
        </div>
      </div>

      <UButton
        :to="`/trips/${trip.id}/settings`"
        icon="i-lucide-settings"
        color="neutral"
        variant="soft"
      >
        Trip settings
      </UButton>
    </div>

    <TripNavigation :trip-id="trip.id" />

    <div class="mb-8 grid gap-4 md:grid-cols-3">
      <UCard>
        <div class="text-sm text-muted">Start</div>

        <div class="mt-1 font-medium">
          {{ trip.startDate }}
        </div>
      </UCard>

      <UCard>
        <div class="text-sm text-muted">End</div>

        <div class="mt-1 font-medium">
          {{ trip.endDate }}
        </div>
      </UCard>

      <UCard>
        <div class="text-sm text-muted">Checklist</div>

        <div class="mt-1 font-medium">Coming next</div>
      </UCard>
    </div>

    <UCard v-if="trip.description">
      <h2 class="mb-3 font-semibold">Notes</h2>

      <p class="whitespace-pre-line text-sm text-muted">
        {{ trip.description }}
      </p>
    </UCard>
  </div>
</template>
