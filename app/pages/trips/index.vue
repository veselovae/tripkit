<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const {
  data: trips,
  status,
  error,
  refresh,
} = await useLazyFetch<Trip[]>("/api/trips");
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div
      class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold">Your trips</h1>

        <p class="mt-1 text-sm text-muted">
          Plan and organize your adventures.
        </p>
      </div>

      <UButton to="/trips/new" icon="i-lucide-plus">Create trip</UButton>
    </div>

    <div
      v-if="!trips && (status === 'idle' || status === 'pending')"
      role="status"
      aria-label="Loading trips"
      aria-busy="true"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <AppSkeletonCard v-for="index in 3" :key="index" :lines="3" />
    </div>

    <AppErrorState
      v-else-if="error && !trips"
      title="Could not load trips"
      @retry="refresh()"
    />

    <div
      v-else-if="!trips?.length"
      class="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-default p-8 text-center"
    >
      <UIcon name="i-lucide-luggage" class="mb-4 size-10 text-muted" />

      <h2 class="text-lg font-medium">No trips yet</h2>

      <p class="mt-2 max-w-sm text-sm text-muted">
        Create your first trip and start organizing everything in one place.
      </p>

      <UButton to="/trips/new" icon="i-lucide-plus" class="mt-6">
        Create your first trip
      </UButton>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" />
    </div>
  </div>
</template>
