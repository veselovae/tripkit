<script setup lang="ts">
const { t } = useI18n();
import type { Transport, TransportType } from "~~/shared/types/transport";
import { toDateTimeLocal, toIsoDateTime } from "~/utils/date";

import { transportTypeOptions } from "~/utils/transportTypes";

const props = defineProps<{
  transport?: Transport | null;
}>();

const emit = defineEmits<{
  submit: [
    payload: {
      type: TransportType;
      provider: string;
      number: string;
      departureLocation: string;
      arrivalLocation: string;
      departureAt: string;
      arrivalAt: string | null;
      departureTerminal: string;
      arrivalTerminal: string;
      seat: string;
      bookingReference: string;
      notes: string;
    },
  ];
  cancel: [];
}>();

const form = reactive({
  type: "flight" as TransportType,
  provider: "",
  number: "",
  departureLocation: "",
  arrivalLocation: "",
  departureAt: "",
  arrivalAt: "",
  departureTerminal: "",
  arrivalTerminal: "",
  seat: "",
  bookingReference: "",
  notes: "",
});

watch(
  () => props.transport,
  (value) => {
    if (!value) {
      Object.assign(form, {
        type: "flight",
        provider: "",
        number: "",
        departureLocation: "",
        arrivalLocation: "",
        departureAt: "",
        arrivalAt: "",
        departureTerminal: "",
        arrivalTerminal: "",
        seat: "",
        bookingReference: "",
        notes: "",
      });

      return;
    }

    Object.assign(form, {
      type: value.type,
      provider: value.provider,
      number: value.number,
      departureLocation: value.departureLocation,
      arrivalLocation: value.arrivalLocation,
      departureAt: toDateTimeLocal(value.departureAt),
      arrivalAt: value.arrivalAt ? toDateTimeLocal(value.arrivalAt) : "",
      departureTerminal: value.departureTerminal,
      arrivalTerminal: value.arrivalTerminal,
      seat: value.seat,
      bookingReference: value.bookingReference,
      notes: value.notes,
    });
  },
  {
    immediate: true,
  },
);

const providerLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return t('transport.airline');
    case "train":
      return t('transport.operator');
    case "bus":
      return t('transport.busCompany');
    case "ferry":
      return t('transport.ferryCompany');
    case "car":
      return t('transport.provider');
    default:
      return t('transport.provider');
  }
});

const numberLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return t('transport.flightNumber');
    case "train":
      return t('transport.trainNumber');
    case "bus":
      return t('transport.routeNumber');
    default:
      return t('transport.number');
  }
});

const departureLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return t('transport.departureAirport');
    case "train":
      return t('transport.departureStation');
    case "bus":
      return t('transport.departureStop');
    case "ferry":
      return t('transport.departurePort');
    default:
      return t('transport.departureLocation');
  }
});

const arrivalLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return t('transport.arrivalAirport');
    case "train":
      return t('transport.arrivalStation');
    case "bus":
      return t('transport.arrivalStop');
    case "ferry":
      return t('transport.arrivalPort');
    default:
      return t('transport.arrivalLocation');
  }
});

const terminalLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return t('transport.terminal');
    case "train":
      return t('transport.platform');
    case "bus":
      return t('transport.platformBay');
    case "ferry":
      return t('transport.terminal');
    default:
      return t('transport.locationDetail');
  }
});

const submit = () => {
  emit("submit", {
    type: form.type,
    provider: form.provider.trim(),
    number: form.number.trim(),
    departureLocation: form.departureLocation.trim(),
    arrivalLocation: form.arrivalLocation.trim(),
    departureAt: toIsoDateTime(form.departureAt),
    arrivalAt: form.arrivalAt ? toIsoDateTime(form.arrivalAt) : null,
    departureTerminal: form.departureTerminal.trim(),
    arrivalTerminal: form.arrivalTerminal.trim(),
    seat: form.seat.trim(),
    bookingReference: form.bookingReference.trim(),
    notes: form.notes.trim(),
  });
};
const localizedOptions = computed(() => transportTypeOptions.map((item) => ({
  ...item, label: t(`transport.${item.value}`),
})));
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <UFormField :label="t('transport.type')" required>
      <USelect
        v-model="form.type"
        :items="localizedOptions"
        value-key="value"
        label-key="label"
        class="w-full"
      />
    </UFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="providerLabel">
        <UInput v-model="form.provider" class="w-full" />
      </UFormField>

      <UFormField :label="numberLabel">
        <UInput v-model="form.number" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="departureLabel" required>
        <UInput v-model="form.departureLocation" class="w-full" />
      </UFormField>

      <UFormField :label="arrivalLabel" required>
        <UInput v-model="form.arrivalLocation" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('transport.departureTime')" required>
        <UInput
          v-model="form.departureAt"
          type="datetime-local"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('transport.arrivalTime')">
        <UInput v-model="form.arrivalAt" type="datetime-local" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('transport.departureDetail', { detail: terminalLabel })">
        <UInput v-model="form.departureTerminal" class="w-full" />
      </UFormField>

      <UFormField :label="t('transport.arrivalDetail', { detail: terminalLabel })">
        <UInput v-model="form.arrivalTerminal" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="t('overview.seat')">
        <UInput v-model="form.seat" class="w-full" />
      </UFormField>

      <UFormField :label="t('transport.bookingReference')">
        <UInput v-model="form.bookingReference" class="w-full" />
      </UFormField>
    </div>

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

      <UButton type="submit">{{ t('transport.save') }}</UButton>
    </div>
  </form>
</template>
