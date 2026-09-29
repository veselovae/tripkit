<script setup lang="ts">
const navigation = [
  {
    label: "Trips",
    icon: "i-lucide-map",
    to: "/trips",
  },
  {
    label: "Checklist",
    icon: "i-lucide-list-checks",
    to: "/checklist",
  },
];
</script>

<template>
  <div class="flex h-full flex-col p-4">
    <div class="mb-8">
      <AppLogo />
    </div>

    <nav class="flex flex-col gap-1">
      <UButton
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        color="neutral"
        variant="ghost"
        class="justify-start"
      />
    </nav>

    <div class="mt-auto">
      <UButton
        to="/settings"
        icon="i-lucide-settings"
        label="Settings"
        color="neutral"
        variant="ghost"
        class="w-full justify-start"
      />
    </div>
  </div>
</template>
