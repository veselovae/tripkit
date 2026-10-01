<script setup lang="ts">
const { t } = useI18n();
import type {
  Accommodation,
  AccommodationType,
} from "~~/shared/types/accommodation";

import { accommodationTypeOptions } from "~/utils/accommodationTypes";
import { toDateTimeLocal, toIsoDateTime } from "~/utils/date";

const props = defineProps<{
  accommodation?: Accommodation | null;
}>();

const emit = defineEmits<{
  submit: [
    payload: {
      type: AccommodationType;
      name: string;
      address: string;
      checkIn: string;
      checkOut: string;
      bookingReference: string;
      phone: string;
      website: string;
      notes: string;
    },
  ];
  cancel: [];
}>();

const form = reactive({
  type: "hotel" as AccommodationType,
  name: "",
  address: "",
  checkIn: "",
  checkOut: "",
  bookingReference: "",
  phone: "",
  website: "",
  notes: "",
});

watch(
  () => props.accommodation,
  (value) => {
    if (!value) {
      Object.assign(form, {
        type: "hotel",
        name: "",
        address: "",
        checkIn: "",
        checkOut: "",
        bookingReference: "",
        phone: "",
        website: "",
        notes: "",
      });

      return;
    }

    Object.assign(form, {
      type: value.type,
      name: value.name,
      address: value.address,
      checkIn: toDateTimeLocal(value.checkIn),
      checkOut: toDateTimeLocal(value.checkOut),
      bookingReference: value.bookingReference,
      phone: value.phone,
      website: value.website,
      notes: value.notes,
    });
  },
  {
    immediate: true,
  },
);

const submit = () => {
  emit("submit", {
    type: form.type,
    name: form.name.trim(),
    address: form.address.trim(),
    checkIn: toIsoDateTime(form.checkIn),
    checkOut: toIsoDateTime(form.checkOut),
    bookingReference: form.bookingReference.trim(),
    phone: form.phone.trim(),
    website: form.website.trim(),
    notes: form.notes.trim(),
  });
};
const localizedOptions = computed(() => accommodationTypeOptions.map((item) => ({
  ...item, label: t(`accommodation.${item.value}`),
})));
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <UFormField :label="t('accommodation.type')" required>
      <USelect
        v-model="form.type"
        :items="localizedOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="t('accommodation.name')" required>
      <UInput
        v-model="form.name"
        :placeholder="t('accommodation.namePlaceholder')"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="t('accommodation.address')">
      <UInput v-model="form.address" class="w-full" />
    </UFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('overview.checkIn')" required>
        <UInput v-model="form.checkIn" type="datetime-local" class="w-full" />
      </UFormField>

      <UFormField :label="t('overview.checkOut')" required>
        <UInput v-model="form.checkOut" type="datetime-local" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('transport.bookingReference')">
        <UInput v-model="form.bookingReference" class="w-full" />
      </UFormField>

      <UFormField :label="t('accommodation.phone')">
        <UInput v-model="form.phone" type="tel" class="w-full" />
      </UFormField>
    </div>

    <UFormField :label="t('accommodation.website')">
      <UInput
        v-model="form.website"
        type="url"
        placeholder="https://..."
        class="w-full"
      />
    </UFormField>

    <UFormField :label="t('transport.notes')">
      <UTextarea v-model="form.notes" :rows="4" class="w-full" />
    </UFormField>

    <div class="flex justify-end gap-3">
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        @click="emit('cancel')"
      >{{ t('common.cancel') }}</UButton>

      <UButton type="submit">{{ t('accommodation.save') }}</UButton>
    </div>
  </form>
</template>
