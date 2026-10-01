<script setup lang="ts">
const { t, locale, setLocale } = useI18n();

const options = [
  { label: "EN", value: "en" },
  { label: "RU", value: "ru" },
];

const selectedLocale = computed({
  get: () => locale.value,
  set: async (value) => {
    await setLocale(value as "en" | "ru");
  },
});
</script>

<template>
  <USelect
    v-model="selectedLocale"
    :items="options"
    value-key="value"
    label-key="label"
    class="w-20"
    :aria-label="t('header.language')"
  />
</template>
