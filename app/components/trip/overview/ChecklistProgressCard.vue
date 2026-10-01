<script setup lang="ts">
const { t } = useI18n();
defineProps<{
  tripId: string;
  total: number;
  completed: number;
  progress: number;
}>();
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list-checks" class="size-5" />
          <h2 class="font-semibold">{{ t('navigation.checklist') }}</h2>
        </div>

        <p class="mt-2 text-sm text-muted">
          {{ t('overview.completed', { completed, total }) }}
        </p>
      </div>

      <div class="text-2xl font-semibold">{{ progress }}%</div>
    </div>

    <UProgress :model-value="progress" class="mt-5" />

    <div class="mt-5 flex justify-end">
      <UButton
        :to="`/trips/${tripId}/checklist`"
        color="neutral"
        variant="soft"
        trailing-icon="i-lucide-arrow-right"
        class="justify-center text-center"
      >{{ t('overview.openChecklist') }}</UButton>
    </div>
  </UCard>
</template>
