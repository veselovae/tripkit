<script setup lang="ts">
const { t } = useI18n();
withDefaults(defineProps<{ form?: boolean }>(), { form: false });
</script>

<template>
  <div role="status" aria-busy="true" :aria-label="t('trip.loading')">
    <span class="sr-only">{{ t('trip.loading') }}</span>
    <div aria-hidden="true">
      <USkeleton class="mb-6 h-8 w-28" />
      <USkeleton class="h-9 w-64 max-w-full" />
      <USkeleton class="mt-2 mb-6 h-5 w-48 max-w-full" />

      <UCard v-if="form">
        <div class="space-y-6">
          <div v-for="index in 4" :key="index" class="space-y-2">
            <USkeleton class="h-4 w-24" />
            <USkeleton :class="index === 4 ? 'h-28' : 'h-9'" class="w-full" />
          </div>
          <USkeleton class="ml-auto h-9 w-32" />
        </div>
      </UCard>

      <template v-else>
        <div class="mb-8 flex flex-wrap gap-2 border-b border-default pb-2">
          <USkeleton v-for="index in 3" :key="index" class="h-8 w-28" />
        </div>
        <div class="space-y-6">
          <AppSkeletonCard :lines="3" />
          <AppSkeletonCard :lines="4" />
        </div>
      </template>
    </div>
  </div>
</template>
