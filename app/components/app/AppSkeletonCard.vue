<script setup lang="ts">
withDefaults(defineProps<{ lines?: number }>(), { lines: 3 });
</script>

<template>
  <UCard>
    <div class="animate-pulse space-y-4">
      <div class="flex items-center gap-3">
        <USkeleton class="size-10 rounded-lg" />

        <div class="flex-1 space-y-2">
          <USkeleton class="h-4 w-32" />
          <USkeleton class="h-3 w-24" />
        </div>
      </div>

      <div class="space-y-2">
        <USkeleton v-for="index in lines" :key="index" class="h-4 w-full" />
      </div>
    </div>
  </UCard>
</template>
