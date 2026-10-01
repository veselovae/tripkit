<script setup lang="ts">
const { t } = useI18n();
defineProps<{
    title?: string;
    description?: string;
    retryLabel?: string;
}>();

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div
    class="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-default p-8 text-center"
  >
    <div
      class="flex size-12 items-center justify-center rounded-full bg-error/10"
    >
      <UIcon name="i-lucide-circle-alert" class="size-6 text-error" />
    </div>

    <h2 class="mt-4 font-semibold">
      {{ title ?? t('common.somethingWentWrong') }}
    </h2>

    <p class="mt-2 max-w-sm text-sm leading-6 text-muted">
      {{ description ?? t('common.loadError') }}
    </p>

    <UButton
      class="mt-5"
      icon="i-lucide-refresh-cw"
      color="neutral"
      variant="soft"
      @click="emit('retry')"
    >
      {{ retryLabel ?? t('common.retry') }}
    </UButton>
  </div>
</template>
