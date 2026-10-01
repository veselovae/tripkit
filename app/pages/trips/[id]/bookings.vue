<script setup lang="ts">
const { t } = useI18n();
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

const toast = useToast();

const { data: trip, status: tripStatus, error: tripError, refresh: refreshTrip } =
  await useLazyFetch<Trip>(`/api/trips/${tripId}`);

const { data: bookings, status: dataStatus, error: dataError, refresh } = await useLazyFetch<{
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
const transportToDelete = ref<Transport | null>(null);
const accommodationToDelete = ref<Accommodation | null>(null);
const transportDeleteDialogOpen = ref(false);
const accommodationDeleteDialogOpen = ref(false);
const deletingTransport = ref(false);
const deletingAccommodation = ref(false);

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
    const isEditing = Boolean(editingTransport.value);

    if (editingTransport.value) {
      await updateTransport(tripId, editingTransport.value.id, payload);
    } else {
      await createTransport(tripId, payload);
    }

    closeTransportModal();

    toast.add({
      title: isEditing ? t('bookings.transportUpdated') : t('bookings.transportAdded'),
      icon: "i-lucide-circle-check",
    });

    await refresh();
  } catch {
    toast.add({
      title: t('bookings.transportSaveError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    transportSaving.value = false;
  }
};

const requestTransportDelete = (transport: Transport) => {
  transportToDelete.value = transport;
  transportDeleteDialogOpen.value = true;
};

const confirmTransportDelete = async () => {
  if (!transportToDelete.value) return;

  deletingTransport.value = true;

  try {
    await deleteTransport(tripId, transportToDelete.value.id);

    toast.add({ title: t('bookings.transportDeleted'), icon: "i-lucide-trash-2" });

    transportDeleteDialogOpen.value = false;
    transportToDelete.value = null;

    await refresh();
  } catch {
    toast.add({
      title: t('bookings.transportDeleteError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    deletingTransport.value = false;
  }
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
    const isEditing = Boolean(editingAccommodation.value);

    if (editingAccommodation.value) {
      await updateAccommodation(tripId, editingAccommodation.value.id, payload);
    } else {
      await createAccommodation(tripId, payload);
    }

    closeAccommodationModal();

    toast.add({
      title: isEditing ? t('bookings.accommodationUpdated') : t('bookings.accommodationAdded'),
      icon: "i-lucide-circle-check",
    });

    await refresh();
  } catch {
    toast.add({
      title: t('bookings.accommodationSaveError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    accommodationSaving.value = false;
  }
};

const requestAccommodationDelete = (accommodation: Accommodation) => {
  accommodationToDelete.value = accommodation;
  accommodationDeleteDialogOpen.value = true;
};

const confirmAccommodationDelete = async () => {
  if (!accommodationToDelete.value) return;

  deletingAccommodation.value = true;

  try {
    await deleteAccommodation(tripId, accommodationToDelete.value.id);

    toast.add({ title: t('bookings.accommodationDeleted'), icon: "i-lucide-trash-2" });

    accommodationDeleteDialogOpen.value = false;
    accommodationToDelete.value = null;

    await refresh();
  } catch {
    toast.add({
      title: t('bookings.accommodationDeleteError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    deletingAccommodation.value = false;
  }
};

const dataLoaded = ref(false);
watch(dataStatus, (status) => {
  if (status === "success") dataLoaded.value = true;
}, { immediate: true });
const loading = computed(() =>
  (!trip.value && (tripStatus.value === "idle" || tripStatus.value === "pending")) ||
  (!dataLoaded.value && (dataStatus.value === "idle" || dataStatus.value === "pending")),
);
const loadError = computed(() =>
  (!trip.value && tripError.value) || (!dataLoaded.value && dataError.value),
);
const retryLoad = () => Promise.all([refreshTrip(), refresh()]);
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <TripPageSkeleton v-if="loading" />
    <AppErrorState
      v-else-if="loadError"
      :title="t('bookings.loadErrorTitle')"
      @retry="retryLoad"
    />
    <template v-else-if="trip">
      <UButton
        :to="`/trips/${tripId}`"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="mb-6"
      >{{ t('trip.back') }}</UButton>

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
        <UButton icon="i-lucide-plane" @click="openCreateTransport">{{ t('overview.addTransport') }}</UButton>

        <UButton
          icon="i-lucide-hotel"
          color="neutral"
          variant="soft"
          @click="openCreateAccommodation"
        >{{ t('overview.addAccommodation') }}</UButton>
      </div>

      <section class="mb-10">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">{{ t('bookings.transport') }}</h2>

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
            @delete="requestTransportDelete"
          />
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-default p-8 text-center"
        >
          <UIcon name="i-lucide-plane" class="mx-auto mb-3 size-8 text-muted" />

          <h3 class="font-medium">{{ t('bookings.noTransportTitle') }}</h3>

          <p class="mt-1 text-sm text-muted">{{ t('bookings.noTransportDescription') }}</p>

          <UButton
            class="mt-5"
            variant="soft"
            icon="i-lucide-plus"
            @click="openCreateTransport"
          >{{ t('overview.addTransport') }}</UButton>
        </div>
      </section>

      <section>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">{{ t('overview.accommodation') }}</h2>

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
            @delete="requestAccommodationDelete"
          />
        </div>

        <div
          v-else
          class="rounded-xl border border-dashed border-default p-8 text-center"
        >
          <UIcon name="i-lucide-hotel" class="mx-auto mb-3 size-8 text-muted" />

          <h3 class="font-medium">{{ t('bookings.noAccommodationTitle') }}</h3>

          <p class="mt-1 text-sm text-muted">{{ t('bookings.noAccommodationDescription') }}</p>

          <UButton
            class="mt-5"
            color="neutral"
            variant="soft"
            icon="i-lucide-plus"
            @click="openCreateAccommodation"
          >{{ t('overview.addAccommodation') }}</UButton>
        </div>
      </section>

      <UModal
        v-model:open="transportModalOpen"
        :title="editingTransport ? t('bookings.editTransport') : t('overview.addTransport')"
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
        :title="editingAccommodation ? t('bookings.editAccommodation') : t('overview.addAccommodation')"
      >
        <template #body>
          <AccommodationForm
            :accommodation="editingAccommodation"
            @submit="saveAccommodation"
            @cancel="closeAccommodationModal"
          />
        </template>
      </UModal>

      <ConfirmDialog
        v-model:open="transportDeleteDialogOpen"
        :title="t('bookings.deleteTransportTitle')"
        :description="transportToDelete ? t('bookings.deleteTransportDescription', { name: transportToDelete.provider || transportToDelete.number || t(`transport.${transportToDelete.type}`) }) : ''"
        :confirm-label="t('bookings.deleteTransport')"
        :loading="deletingTransport"
        @confirm="confirmTransportDelete"
      />

      <ConfirmDialog
        v-model:open="accommodationDeleteDialogOpen"
        :title="t('bookings.deleteAccommodationTitle')"
        :description="accommodationToDelete ? t('bookings.deleteAccommodationDescription', { name: accommodationToDelete.name }) : ''"
        :confirm-label="t('bookings.deleteAccommodation')"
        :loading="deletingAccommodation"
        @confirm="confirmAccommodationDelete"
      />
    </template>
  </div>
</template>
