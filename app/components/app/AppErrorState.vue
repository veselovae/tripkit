<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    retryLabel?: string;
  }>(),
  {
    title: "Something went wrong",
    description: "We could not load this data.",
    retryLabel: "Try again",
  },
);

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
      {{ title }}
    </h2>

    <p class="mt-2 max-w-sm text-sm leading-6 text-muted">
      {{ description }}
    </p>

    <UButton
      class="mt-5"
      icon="i-lucide-refresh-cw"
      color="neutral"
      variant="soft"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </UButton>
  </div>
</template>
