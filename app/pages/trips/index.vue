<script setup lang="ts">
const trips = [];
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div
      class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-semibold">Your trips</h1>

        <p class="mt-1 text-sm text-muted">
          Plan and organize your upcoming adventures.
        </p>
      </div>

      <UButton to="/trips/new" icon="i-lucide-plus" label="Create trip" />
    </div>

    <div
      v-if="trips.length === 0"
      class="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-default p-8 text-center"
    >
      <div
        class="mb-4 flex size-12 items-center justify-center rounded-full bg-elevated"
      >
        <UIcon name="i-lucide-luggage" class="size-6 text-muted" />
      </div>

      <h2 class="text-lg font-medium">No trips yet</h2>

      <p class="mt-2 max-w-sm text-sm text-muted">
        Create your first trip and start organizing checklists, bookings and
        travel details.
      </p>

      <UButton
        to="/trips/new"
        icon="i-lucide-plus"
        label="Create your first trip"
        class="mt-6"
      />
    </div>
  </div>
</template>
