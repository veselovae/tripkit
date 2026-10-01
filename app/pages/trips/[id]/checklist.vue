<script setup lang="ts">
const { t } = useI18n();
import { useChecklist } from "~/composables/useChecklist";
import type { ChecklistGroupWithItems } from "~~/shared/types/checklist";
import { checklistIcons } from "~/utils/checklistIcons";
import { VueDraggable } from "vue-draggable-plus";

import type { Trip } from "~~/shared/types/trip";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const tripId = String(route.params.id);

const { createGroup, reorderGroups, applyDefaultTemplate } = useChecklist();

const { data: trip, status: tripStatus, error: tripError, refresh: refreshTrip } =
  await useLazyFetch<Trip>(`/api/trips/${tripId}`);

const { data: groups, status: dataStatus, error: dataError, refresh } = await useLazyFetch<ChecklistGroupWithItems[]>(
  `/api/trips/${tripId}/checklist`,
  { default: () => [] },
);

const groupForm = reactive({
  title: "",
  icon: "list-checks",
});

const creatingGroup = ref(false);
const applyingTemplate = ref(false);
const localGroups = ref<ChecklistGroupWithItems[]>([]);

watch(
  groups,
  (value) => {
    localGroups.value = value ? [...value] : [];
  },
  { immediate: true, deep: true },
);

const useStarterTemplate = async () => {
  applyingTemplate.value = true;

  try {
    await applyDefaultTemplate(tripId);
    await refresh();
  } finally {
    applyingTemplate.value = false;
  }
};

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

const saveGroupsOrder = async () => {
  const payload = localGroups.value.map((group, index) => ({
    id: group.id,
    sortOrder: (index + 1) * 100,
  }));

  try {
    await reorderGroups(payload);

    await refresh();
  } catch {
    await refresh();
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
const localizedOptions = computed(() => checklistIcons.map((item) => ({
  ...item, label: t(`checklist.icons.${item.value}`),
})));
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <TripPageSkeleton v-if="loading" />
    <AppErrorState
      v-else-if="loadError"
      :title="t('checklist.loadErrorTitle')"
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

      <UCard class="mb-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="font-medium">{{ t('checklist.progress') }}</div>

            <div class="mt-1 text-sm text-muted">
              {{ t('checklist.completed', { completed: completedItems, total: totalItems }) }}
            </div>
          </div>

          <div class="text-lg font-semibold">{{ progress }}%</div>
        </div>

        <UProgress :model-value="progress" class="mt-4" />
      </UCard>

      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <UFormField :label="t('checklist.newGroup')" class="flex-1">
          <UInput
            v-model="groupForm.title"
            :placeholder="t('navigation.documents')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('checklist.icon')">
          <USelect
            v-model="groupForm.icon"
            :icon="`i-lucide-${groupForm.icon}`"
            :items="localizedOptions"
            value-key="value"
            label-key="label"
            class="w-48"
          />
        </UFormField>

        <UButton icon="i-lucide-plus" :loading="creatingGroup" @click="addGroup">{{ t('checklist.addGroup') }}</UButton>
      </div>

      <VueDraggable
        v-if="localGroups.length"
        v-model="localGroups"
        handle=".group-drag-handle"
        :animation="180"
        class="space-y-4"
        @end="saveGroupsOrder"
      >
        <ChecklistGroup
          v-for="group in localGroups"
          :key="group.id"
          :group="group"
          @refresh="refresh"
        />
      </VueDraggable>

      <div
        v-else
        class="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-default text-center"
      >
        <UIcon name="i-lucide-list-checks" class="mb-4 size-10 text-muted" />

        <h2 class="font-medium">{{ t('checklist.emptyTitle') }}</h2>

        <p class="mt-2 max-w-sm text-sm text-muted">{{ t('checklist.emptyDescription') }}</p>

        <UButton
          icon="i-lucide-sparkles"
          variant="soft"
          class="mt-6"
          :loading="applyingTemplate"
          @click="useStarterTemplate"
        >{{ t('checklist.starterTemplate') }}</UButton>
      </div>
    </template>
  </div>
</template>
