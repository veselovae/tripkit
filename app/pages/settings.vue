<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">{{ t('common.settings') }}</h1>

    <p class="mt-1 text-sm text-muted">{{ t('settings.description') }}</p>
  </div>
</template>
