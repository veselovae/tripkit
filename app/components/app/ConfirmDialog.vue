<script setup lang="ts">
const { t } = useI18n();
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
}>();

const close = () => {
  emit("update:open", false);
};
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-error/10"
          >
            <UIcon name="i-lucide-triangle-alert" class="size-5 text-error" />
          </div>

          <div>
            <p class="text-sm leading-6 text-muted">
              {{ description }}
            </p>

            <p class="mt-2 text-sm font-medium">{{ t('common.actionCannotBeUndone') }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="loading"
            @click="close"
          >
            {{ cancelLabel ?? t('common.cancel') }}
          </UButton>

          <UButton color="error" :loading="loading" @click="emit('confirm')">
            {{ confirmLabel ?? t('common.delete') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
