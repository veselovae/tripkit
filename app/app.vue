<script setup lang="ts">
import { en, ru } from "@nuxt/ui/locale";

const { locale } = useI18n();
const uiLocale = computed(() => locale.value === "ru" ? ru : en);
useHead(() => ({ htmlAttrs: { lang: locale.value } }));
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
