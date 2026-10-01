<script setup lang="ts">
defineProps<{ tripId: string }>();
</script>

<template>
  <nav class="mb-8 flex gap-1 overflow-x-auto border-b border-default">
    <UButton :to="`/trips/${tripId}`" color="neutral" variant="ghost">
      Overview
    </UButton>

    <UButton :to="`/trips/${tripId}/checklist`" color="neutral" variant="ghost">
      Checklist
    </UButton>

    <UButton :to="`/trips/${tripId}/bookings`" color="neutral" variant="ghost">
      Bookings
    </UButton>

    <UTooltip text="In development" :content="{ side: 'top' }">
      <div
        tabindex="0"
        aria-disabled="true"
        class="flex cursor-not-allowed items-center gap-2 px-3 py-2 text-sm text-muted opacity-70"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-4 text-warning" />
        <span> Documents </span>
      </div>
    </UTooltip>
  </nav>
</template>
