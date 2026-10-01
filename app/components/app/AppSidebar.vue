<script setup lang="ts">
const { t } = useI18n();
const navigation = computed(() => [
  {
    label: t('navigation.trips'),
    icon: "i-lucide-map",
    to: "/trips",
  },
]);
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
        :label="t('common.settings')"
        color="neutral"
        variant="ghost"
        class="w-full justify-start"
      />
    </div>
  </div>
</template>
