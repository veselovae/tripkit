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

    <UButton disabled color="neutral" variant="ghost">Documents</UButton>
  </nav>
</template>
