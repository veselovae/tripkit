<script setup lang="ts">
const props = defineProps<{ tripId: string }>();

const route = useRoute();

const items = computed(() => [
  {
    label: "Overview",
    icon: "i-lucide-layout-dashboard",
    to: `/trips/${props.tripId}`,
  },
  {
    label: "Checklist",
    icon: "i-lucide-list-checks",
    to: `/trips/${props.tripId}/checklist`,
  },
  {
    label: "Bookings",
    icon: "i-lucide-calendar-days",
    to: `/trips/${props.tripId}/bookings`,
  },
]);

const isActive = (to: string) => {
  if (to === `/trips/${props.tripId}`) return route.path === to;

  return route.path.startsWith(to);
};
</script>

<template>
  <nav class="mb-8 flex flex-wrap gap-1 border-b border-default">
    <UButton
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :icon="item.icon"
      color="neutral"
      variant="ghost"
      class="relative shrink-0 rounded-b-none"
      :class="{
        'text-primary': isActive(item.to),
      }"
    >
      {{ item.label }}

      <span
        v-if="isActive(item.to)"
        class="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
      />
    </UButton>

    <!-- <UTooltip text="In development" :content="{ side: 'top' }">
      <div
        tabindex="0"
        aria-disabled="true"
        class="flex cursor-not-allowed items-center gap-2 px-3 py-2 text-sm text-muted opacity-70"
      >
        <UIcon name="i-lucide-triangle-alert" class="size-4 text-warning" />
        <span> Documents </span>
      </div>
    </UTooltip> -->
  </nav>
</template>
