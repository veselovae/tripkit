<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

defineProps<{ trip: Trip }>();
</script>

<template>
  <NuxtLink :to="`/trips/${trip.id}`">
    <UCard class="h-full transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="mb-6">
        <div
          class="mb-4 flex size-10 items-center justify-center rounded-xl bg-elevated"
        >
          <UIcon name="i-lucide-map-pin" class="size-5" />
        </div>

        <h2 class="text-lg font-semibold">
          {{ trip.title }}
        </h2>

        <p class="mt-1 text-sm text-muted">
          {{ trip.destination }}
        </p>
      </div>

      <div class="flex items-center gap-2 text-sm text-muted">
        <UIcon name="i-lucide-calendar" class="size-4" />

        <span>
          {{ trip.startDate }}
          —
          {{ trip.endDate }}
        </span>
      </div>
    </UCard>
  </NuxtLink>
</template>
