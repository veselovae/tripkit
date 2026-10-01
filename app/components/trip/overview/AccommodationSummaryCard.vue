<script setup lang="ts">
const { t, locale } = useI18n();
import type { Accommodation } from "~~/shared/types/accommodation";
import { accommodationIcons } from "~/utils/accommodationTypes";

defineProps<{
  tripId: string;
  accommodation: Accommodation | null;
}>();
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-hotel" class="size-5" />
        <h2 class="font-semibold">{{ t('overview.accommodation') }}</h2>
      </div>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        color="neutral"
        variant="ghost"
        size="xs"
        trailing-icon="i-lucide-arrow-right"
        class="justify-center text-center"
      >{{ t('overview.allBookings') }}</UButton>
    </div>

    <div v-if="accommodation" class="mt-5">
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated"
        >
          <UIcon
            :name="accommodationIcons[accommodation.type] ?? 'i-lucide-house'"
            class="size-5"
          />
        </div>

        <div>
          <div class="text-xs font-medium uppercase tracking-wide text-muted">
            {{ t(`accommodation.${accommodation.type}`) }}
          </div>

          <div class="mt-1 font-semibold">
            {{ accommodation.name }}
          </div>

          <div v-if="accommodation.address" class="mt-1 text-sm text-muted">
            {{ accommodation.address }}
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div class="text-xs text-muted">{{ t('overview.checkIn') }}</div>

          <div class="mt-1 font-medium">
            {{ formatDateTime(accommodation.checkIn, locale) }}
          </div>
        </div>

        <div>
          <div class="text-xs text-muted">{{ t('overview.checkOut') }}</div>

          <div class="mt-1 font-medium">
            {{ formatDateTime(accommodation.checkOut, locale) }}
          </div>
        </div>
      </div>

      <div
        v-if="accommodation.bookingReference"
        class="mt-4 text-sm text-muted"
      >{{ t('overview.booking') }}: {{ accommodation.bookingReference }}
      </div>
    </div>

    <div
      v-else
      class="mt-5 rounded-lg border border-dashed border-default p-6 text-center"
    >
      <UIcon name="i-lucide-hotel" class="mx-auto size-7 text-muted" />

      <p class="mt-2 text-sm text-muted">{{ t('overview.noAccommodation') }}</p>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        class="mt-4"
        size="sm"
        variant="soft"
      >{{ t('overview.addAccommodation') }}</UButton>
    </div>
  </UCard>
</template>
