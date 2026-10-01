<script setup lang="ts">
import type { Trip } from "~~/shared/types/trip";

import type { Transport } from "~~/shared/types/transport";

import type { Accommodation } from "~~/shared/types/accommodation";
import { useBookings } from "~/composables/useBookings";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);

const {
  createTransport,
  updateTransport,
  deleteTransport,

  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = useBookings();

const { data: trip } = await useFetch<Trip>(`/api/trips/${tripId}`);

if (!trip.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Trip not found",
  });
}

const { data: bookings, refresh } = await useFetch<{
  transport: Transport[];
  accommodations: Accommodation[];
}>(`/api/trips/${tripId}/bookings`, {
  default: () => ({
    transport: [],
    accommodations: [],
  }),
});

const transportModalOpen = ref(false);
const accommodationModalOpen = ref(false);
const editingTransport = ref<Transport | null>(null);
const editingAccommodation = ref<Accommodation | null>(null);
const transportSaving = ref(false);
const accommodationSaving = ref(false);

const openCreateTransport = () => {
  editingTransport.value = null;
  transportModalOpen.value = true;
};

const openEditTransport = (transport: Transport) => {
  editingTransport.value = transport;
  transportModalOpen.value = true;
};

const closeTransportModal = () => {
  transportModalOpen.value = false;
  editingTransport.value = null;
};

const saveTransport = async (payload: any) => {
  transportSaving.value = true;

  try {
    if (editingTransport.value) {
      await updateTransport(editingTransport.value.id, payload);
    } else {
      await createTransport(tripId, payload);
    }

    closeTransportModal();

    await refresh();
  } finally {
    transportSaving.value = false;
  }
};

const removeTransport = async (transport: Transport) => {
  const confirmed = window.confirm(
    `Delete transport "${transport.provider || transport.number || transport.type}"?`,
  );

  if (!confirmed) return;

  await deleteTransport(transport.id);
  await refresh();
};

const openCreateAccommodation = () => {
  editingAccommodation.value = null;
  accommodationModalOpen.value = true;
};

const openEditAccommodation = (accommodation: Accommodation) => {
  editingAccommodation.value = accommodation;
  accommodationModalOpen.value = true;
};

const closeAccommodationModal = () => {
  accommodationModalOpen.value = false;
  editingAccommodation.value = null;
};

const saveAccommodation = async (payload: any) => {
  accommodationSaving.value = true;

  try {
    if (editingAccommodation.value) {
      await updateAccommodation(editingAccommodation.value.id, payload);
    } else {
      await createAccommodation(tripId, payload);
    }

    closeAccommodationModal();

    await refresh();
  } finally {
    accommodationSaving.value = false;
  }
};

const removeAccommodation = async (accommodation: Accommodation) => {
  const confirmed = window.confirm(`Delete "${accommodation.name}"?`);

  if (!confirmed) return;

  await deleteAccommodation(accommodation.id);
  await refresh();
};
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <UButton
      :to="`/trips/${tripId}`"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="mb-6"
    >
      Back to trip
    </UButton>

    <div class="mb-6">
      <h1 class="text-3xl font-semibold">
        {{ trip?.title }}
      </h1>

      <p class="mt-1 text-muted">
        {{ trip?.destination }}
      </p>
    </div>

    <TripNavigation :trip-id="tripId" />

    <div class="mb-8 flex flex-wrap gap-3">
      <UButton icon="i-lucide-plane" @click="openCreateTransport">
        Add transport
      </UButton>

      <UButton
        icon="i-lucide-hotel"
        color="neutral"
        variant="soft"
        @click="openCreateAccommodation"
      >
        Add accommodation
      </UButton>
    </div>

    <section class="mb-10">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Transport</h2>

        <span class="text-sm text-muted">
          {{ bookings?.transport.length ?? 0 }}
        </span>
      </div>

      <div v-if="bookings?.transport.length" class="space-y-4">
        <TransportCard
          v-for="transport in bookings.transport"
          :key="transport.id"
          :transport="transport"
          @edit="openEditTransport"
          @delete="removeTransport"
        />
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-default p-8 text-center"
      >
        <UIcon name="i-lucide-plane" class="mx-auto mb-3 size-8 text-muted" />

        <h3 class="font-medium">No transport yet</h3>

        <p class="mt-1 text-sm text-muted">
          Add your flight, train or other transport.
        </p>

        <UButton
          class="mt-5"
          variant="soft"
          icon="i-lucide-plus"
          @click="openCreateTransport"
        >
          Add transport
        </UButton>
      </div>
    </section>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Accommodation</h2>

        <span class="text-sm text-muted">
          {{ bookings?.accommodations.length ?? 0 }}
        </span>
      </div>

      <div v-if="bookings?.accommodations.length" class="space-y-4">
        <AccommodationCard
          v-for="accommodation in bookings.accommodations"
          :key="accommodation.id"
          :accommodation="accommodation"
          @edit="openEditAccommodation"
          @delete="removeAccommodation"
        />
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-default p-8 text-center"
      >
        <UIcon name="i-lucide-hotel" class="mx-auto mb-3 size-8 text-muted" />

        <h3 class="font-medium">No accommodation yet</h3>

        <p class="mt-1 text-sm text-muted">
          Add your hotel, apartment or hostel.
        </p>

        <UButton
          class="mt-5"
          color="neutral"
          variant="soft"
          icon="i-lucide-plus"
          @click="openCreateAccommodation"
        >
          Add accommodation
        </UButton>
      </div>
    </section>

    <UModal
      v-model:open="transportModalOpen"
      :title="editingTransport ? 'Edit transport' : 'Add transport'"
    >
      <template #body>
        <TransportForm
          :transport="editingTransport"
          @submit="saveTransport"
          @cancel="closeTransportModal"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="accommodationModalOpen"
      :title="editingAccommodation ? 'Edit accommodation' : 'Add accommodation'"
    >
      <template #body>
        <AccommodationForm
          :accommodation="editingAccommodation"
          @submit="saveAccommodation"
          @cancel="closeAccommodationModal"
        />
      </template>
    </UModal>
  </div>
</template>
