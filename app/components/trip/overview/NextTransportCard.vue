<script setup lang="ts">
import type { Transport } from "~~/shared/types/transport";

import { transportIcons } from "~/utils/transportTypes";

defineProps<{
  tripId: string;
  transport: Transport | null;
}>();
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-route" class="size-5" />
        <h2 class="font-semibold">Next transport</h2>
      </div>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        color="neutral"
        variant="ghost"
        size="xs"
        trailing-icon="i-lucide-arrow-right"
        class="justify-center text-center"
      >
        All bookings
      </UButton>
    </div>

    <div v-if="transport" class="mt-5">
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated"
        >
          <UIcon
            :name="transportIcons[transport.type] ?? 'i-lucide-route'"
            class="size-5"
          />
        </div>

        <div class="min-w-0">
          <div class="text-xs font-medium uppercase tracking-wide text-muted">
            {{ transport.type }}
          </div>

          <div class="mt-1 font-semibold">
            <template v-if="transport.provider">
              {{ transport.provider }}
            </template>

            <template v-if="transport.number">
              {{ transport.provider ? " · " : "" }}

              {{ transport.number }}
            </template>

            <template v-if="!transport.provider && !transport.number">
              Transport
            </template>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <div class="font-medium">
            {{ transport.departureLocation }}
          </div>

          <div class="mt-1 text-sm text-muted">
            {{ formatDateTime(transport.departureAt) }}
          </div>
        </div>

        <UIcon
          name="i-lucide-arrow-right"
          class="hidden size-4 text-muted sm:block"
        />

        <div class="sm:text-right">
          <div class="font-medium">
            {{ transport.arrivalLocation }}
          </div>

          <div v-if="transport.arrivalAt" class="mt-1 text-sm text-muted">
            {{ formatDateTime(transport.arrivalAt) }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-5 rounded-lg border border-dashed border-default p-6 text-center"
    >
      <UIcon name="i-lucide-plane" class="mx-auto size-7 text-muted" />

      <p class="mt-2 text-sm text-muted">No transport added yet.</p>

      <UButton
        :to="`/trips/${tripId}/bookings`"
        class="mt-4"
        size="sm"
        variant="soft"
      >
        Add transport
      </UButton>
    </div>
  </UCard>
</template>
