<script setup lang="ts">
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
      return "Airline";
    case "train":
      return "Operator";
    case "bus":
      return "Bus company";
    case "ferry":
      return "Ferry company";
    case "car":
      return "Provider";
    default:
      return "Provider";
  }
});

const numberLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return "Flight number";
    case "train":
      return "Train number";
    case "bus":
      return "Route number";
    default:
      return "Number";
  }
});

const departureLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return "Departure airport";
    case "train":
      return "Departure station";
    case "bus":
      return "Departure stop";
    case "ferry":
      return "Departure port";
    default:
      return "Departure location";
  }
});

const arrivalLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return "Arrival airport";
    case "train":
      return "Arrival station";
    case "bus":
      return "Arrival stop";
    case "ferry":
      return "Arrival port";
    default:
      return "Arrival location";
  }
});

const terminalLabel = computed(() => {
  switch (form.type) {
    case "flight":
      return "Terminal";
    case "train":
      return "Platform";
    case "bus":
      return "Platform / bay";
    case "ferry":
      return "Terminal";
    default:
      return "Location detail";
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
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <UFormField label="Transport type" required>
      <USelect
        v-model="form.type"
        :items="transportTypeOptions"
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
      <UFormField label="Departure time" required>
        <UInput
          v-model="form.departureAt"
          type="datetime-local"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Arrival time">
        <UInput v-model="form.arrivalAt" type="datetime-local" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField :label="`Departure ${terminalLabel}`">
        <UInput v-model="form.departureTerminal" class="w-full" />
      </UFormField>

      <UFormField :label="`Arrival ${terminalLabel}`">
        <UInput v-model="form.arrivalTerminal" class="w-full" />
      </UFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="Seat">
        <UInput v-model="form.seat" class="w-full" />
      </UFormField>

      <UFormField label="Booking reference">
        <UInput v-model="form.bookingReference" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="Notes">
      <UTextarea v-model="form.notes" :rows="4" class="w-full" />
    </UFormField>

    <div class="flex justify-end gap-3">
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        @click="emit('cancel')"
      >
        Cancel
      </UButton>

      <UButton type="submit"> Save transport </UButton>
    </div>
  </form>
</template>
