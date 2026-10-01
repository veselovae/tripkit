<script setup lang="ts">
const { t, locale } = useI18n();
import type { TripOverview } from "~~/shared/types/tripOverview";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const tripId = computed(() => String(route.params.id));

const {
  data: overview,
  error,
  status,
  refresh,
} = await useLazyFetch<TripOverview>(() => `/api/trips/${tripId.value}/overview`);

const trip = computed(() => overview.value?.trip ?? null);

const checklist = computed(
  () =>
    overview.value?.checklist ?? {
      total: 0,
      completed: 0,
      progress: 0,
    },
);

const nextTransport = computed(() => overview.value?.nextTransport ?? null);

const accommodation = computed(() => overview.value?.accommodation ?? null);

const loading = computed(() => status.value === "idle" || status.value === "pending");

const formatTripDate = (value: string) => {
  return new Intl.DateTimeFormat(locale.value, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const retry = async () => {
  await refresh();
};
</script>

<template>
  <div class="mx-auto w-full max-w-6xl">
    <template v-if="loading && !overview">
      <div class="mb-8" role="status" aria-busy="true" :aria-label="t('overview.loading')">
        <USkeleton class="h-8 w-24" />

        <USkeleton class="mt-6 h-10 w-64 max-w-full" />

        <USkeleton class="mt-3 h-5 w-80 max-w-full" />
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <AppSkeletonCard :lines="3" />
        <AppSkeletonCard :lines="3" />
        <AppSkeletonCard :lines="4" />
        <AppSkeletonCard :lines="4" />
      </div>
    </template>

    <AppErrorState
      v-else-if="error && !overview"
      :title="t('overview.loadErrorTitle')"
      :description="t('overview.loadErrorDescription')"
      @retry="retry"
    />

    <template v-else-if="trip">
      <div
        class="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
      >
        <div class="min-w-0">
          <UButton
            to="/trips"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
          >{{ t('navigation.trips') }}</UButton>

          <h1
            class="mt-5 break-words text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {{ trip.title }}
          </h1>

          <div
            class="mt-3 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-5"
          >
            <div class="flex min-w-0 items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="size-4 shrink-0" />

              <span class="truncate">
                {{ trip.destination }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar-days" class="size-4 shrink-0" />

              <span>
                {{ formatTripDate(trip.startDate) }}
                —
                {{ formatTripDate(trip.endDate) }}
              </span>
            </div>
          </div>

          <p
            v-if="trip.description"
            class="mt-4 max-w-2xl break-words text-sm leading-6 text-muted"
          >
            {{ trip.description }}
          </p>
        </div>

        <UButton
          :to="`/trips/${tripId}/settings`"
          icon="i-lucide-settings"
          color="neutral"
          variant="soft"
          class="self-start"
        >{{ t('trip.settings') }}</UButton>
      </div>

      <TripNavigation :trip-id="tripId" />

      <div class="grid gap-4 sm:gap-6 xl:grid-cols-2">
        <ChecklistProgressCard
          :trip-id="tripId"
          :total="checklist.total"
          :completed="checklist.completed"
          :progress="checklist.progress"
        />

        <QuickActionsCard :trip-id="tripId" />

        <NextTransportCard :trip-id="tripId" :transport="nextTransport" />

        <AccommodationSummaryCard
          :trip-id="tripId"
          :accommodation="accommodation"
        />
      </div>
    </template>
  </div>
</template>
