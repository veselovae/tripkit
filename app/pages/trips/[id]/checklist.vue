<script setup lang="ts">
import { useChecklist } from "~/composables/useChecklist";
import type { ChecklistGroupWithItems } from "~~/shared/types/checklist";

import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);

const { createGroup } = useChecklist();

const { data: trip } = await useFetch<Trip>(`/api/trips/${tripId}`);

if (!trip.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Trip not found",
  });
}

const { data: groups, refresh } = await useFetch<ChecklistGroupWithItems[]>(
  `/api/trips/${tripId}/checklist`,
  { default: () => [] },
);

const groupForm = reactive({
  title: "",
  icon: "list-checks",
});

const creatingGroup = ref(false);

const icons = [
  "list-checks",
  "file-text",
  "plug",
  "shirt",
  "luggage",
  "pill",
  "wallet-cards",
  "camera",
  "map",
  "plane",
  "utensils",
  "shopping-bag",
];

const addGroup = async () => {
  if (!groupForm.title.trim()) return;

  creatingGroup.value = true;

  try {
    await createGroup(tripId, {
      title: groupForm.title,
      icon: groupForm.icon,
    });

    groupForm.title = "";
    groupForm.icon = "list-checks";

    await refresh();
  } finally {
    creatingGroup.value = false;
  }
};

const totalItems = computed(() =>
  groups.value.reduce((total, group) => total + group.items.length, 0),
);

const completedItems = computed(() =>
  groups.value.reduce(
    (total, group) =>
      total + group.items.filter((item) => item.completed).length,
    0,
  ),
);

const progress = computed(() => {
  if (totalItems.value === 0) return 0;

  return Math.round((completedItems.value / totalItems.value) * 100);
});
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

    <UCard class="mb-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="font-medium">Checklist progress</div>

          <div class="mt-1 text-sm text-muted">
            {{ completedItems }}
            of
            {{ totalItems }}
            completed
          </div>
        </div>

        <div class="text-lg font-semibold">{{ progress }}%</div>
      </div>

      <UProgress :model-value="progress" class="mt-4" />
    </UCard>

    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
      <UFormField label="New group" class="flex-1">
        <UInput
          v-model="groupForm.title"
          placeholder="Documents"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Icon">
        <USelect v-model="groupForm.icon" :items="icons" class="w-48" />
      </UFormField>

      <UButton icon="i-lucide-plus" :loading="creatingGroup" @click="addGroup">
        Add group
      </UButton>
    </div>

    <div v-if="groups.length" class="space-y-4">
      <ChecklistGroup
        v-for="group in groups"
        :key="group.id"
        :group="group"
        @refresh="refresh"
      />
    </div>

    <div
      v-else
      class="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-default text-center"
    >
      <UIcon name="i-lucide-list-checks" class="mb-4 size-10 text-muted" />

      <h2 class="font-medium">Your checklist is empty</h2>

      <p class="mt-2 max-w-sm text-sm text-muted">
        Create a group such as Documents, Electronics or Clothes.
      </p>
    </div>
  </div>
</template>
