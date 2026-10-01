<script setup lang="ts">
const { t, locale } = useI18n();
import type { Accommodation } from "~~/shared/types/accommodation";

import { accommodationIcons } from "~/utils/accommodationTypes";
import { formatDateTime } from "~/utils/date";

defineProps<{
  accommodation: Accommodation;
}>();

const emit = defineEmits<{
  edit: [accommodation: Accommodation];
  delete: [accommodation: Accommodation];
}>();
</script>

<template>
  <UCard>
    <div class="flex items-start gap-4">
      <div
        class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-elevated"
      >
        <UIcon
          :name="accommodationIcons[accommodation.type] ?? 'i-lucide-house'"
          class="size-5"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex gap-3 justify-between">
          <div>
            <div class="text-xs font-medium uppercase tracking-wide text-muted">
              {{ t(`accommodation.${accommodation.type}`) }}
            </div>

            <h3 class="mt-1 text-lg font-semibold">
              {{ accommodation.name }}
            </h3>

            <p v-if="accommodation.address" class="mt-1 text-sm text-muted">
              {{ accommodation.address }}
            </p>
          </div>

          <div class="flex gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="emit('edit', accommodation)"
            />

            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="emit('delete', accommodation)"
            />
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
          v-if="
            accommodation.bookingReference ||
            accommodation.phone ||
            accommodation.website
          "
          class="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-default pt-4 text-sm text-muted"
        >
          <span v-if="accommodation.bookingReference">{{ t('overview.booking') }}: {{ accommodation.bookingReference }}
          </span>

          <span v-if="accommodation.phone">
            {{ accommodation.phone }}
          </span>

          <a
            v-if="accommodation.website"
            :href="accommodation.website"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >{{ t('accommodation.website') }}</a>
        </div>

        <p v-if="accommodation.notes" class="mt-4 text-sm text-muted">
          {{ accommodation.notes }}
        </p>
      </div>
    </div>
  </UCard>
</template>
