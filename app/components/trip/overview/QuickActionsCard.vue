<script setup lang="ts">
const { t } = useI18n();
defineProps<{ tripId: string }>();
</script>

<template>
  <UCard>
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-zap" class="size-5" />
      <h2 class="font-semibold">{{ t('overview.quickActions') }}</h2>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <UButton
        :to="`/trips/${tripId}/checklist`"
        icon="i-lucide-list-checks"
        color="neutral"
        variant="soft"
        block
      >{{ t('navigation.checklist') }}</UButton>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        icon="i-lucide-calendar-days"
        color="neutral"
        variant="soft"
        block
      >{{ t('navigation.bookings') }}</UButton>
    </div>
  </UCard>
</template>
