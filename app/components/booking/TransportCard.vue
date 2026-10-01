<script setup lang="ts">
import type { Transport } from "~~/shared/types/transport";

import { transportIcons } from "~/utils/transportTypes";
import { formatDateTime } from "~/utils/date";

defineProps<{
  transport: Transport;
}>();

const emit = defineEmits<{
  edit: [transport: Transport];
  delete: [transport: Transport];
}>();
</script>

<template>
  <UCard>
    <div class="flex items-start gap-4">
      <div
        class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-elevated"
      >
        <UIcon
          :name="transportIcons[transport.type] ?? 'i-lucide-route'"
          class="size-5"
        />
      </div>

      <div class="min-w-0 flex-1">
        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div class="text-xs font-medium uppercase tracking-wide text-muted">
              {{ transport.type }}
            </div>

            <h3 class="mt-1 text-lg font-semibold">
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
            </h3>
          </div>

          <div class="flex gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="emit('edit', transport)"
            />

            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="emit('delete', transport)"
            />
          </div>
        </div>

        <div
          class="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
        >
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
            class="hidden size-5 text-muted md:block"
          />

          <div class="md:text-right">
            <div class="font-medium">
              {{ transport.arrivalLocation }}
            </div>

            <div v-if="transport.arrivalAt" class="mt-1 text-sm text-muted">
              {{ formatDateTime(transport.arrivalAt) }}
            </div>
          </div>
        </div>

        <div
          v-if="
            transport.departureTerminal ||
            transport.arrivalTerminal ||
            transport.seat ||
            transport.bookingReference
          "
          class="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-default pt-4 text-sm text-muted"
        >
          <span v-if="transport.departureTerminal">
            Departure:
            {{ transport.departureTerminal }}
          </span>

          <span v-if="transport.arrivalTerminal">
            Arrival:
            {{ transport.arrivalTerminal }}
          </span>

          <span v-if="transport.seat">
            Seat:
            {{ transport.seat }}
          </span>

          <span v-if="transport.bookingReference">
            Booking:
            {{ transport.bookingReference }}
          </span>
        </div>

        <p v-if="transport.notes" class="mt-4 text-sm text-muted">
          {{ transport.notes }}
        </p>
      </div>
    </div>
  </UCard>
</template>
