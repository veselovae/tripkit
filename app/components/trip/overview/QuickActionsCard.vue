<script setup lang="ts">
defineProps<{ tripId: string }>();
</script>

<template>
  <UCard>
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-zap" class="size-5" />
      <h2 class="font-semibold">Quick actions</h2>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <UButton
        :to="`/trips/${tripId}/checklist`"
        icon="i-lucide-list-checks"
        color="neutral"
        variant="soft"
        block
      >
        Checklist
      </UButton>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        icon="i-lucide-calendar-days"
        color="neutral"
        variant="soft"
        block
      >
        Bookings
      </UButton>
    </div>
  </UCard>
</template>
