<script setup lang="ts">
import { useChecklist } from "~/composables/useChecklist";
import type { ChecklistGroupWithItems } from "~~/shared/types/checklist";
import { VueDraggable } from "vue-draggable-plus";

const props = defineProps<{ group: ChecklistGroupWithItems }>();
const emit = defineEmits<{ refresh: [] }>();

const { createItem, updateGroup, deleteGroup, reorderItems } = useChecklist();

const newItem = ref("");
const adding = ref(false);

const editingGroup = ref(false);
const groupTitle = ref(props.group.title);

watch(
  () => props.group.title,
  (value) => {
    groupTitle.value = value;
  },
);

const saveGroup = async () => {
  const title = groupTitle.value.trim();

  if (!title) return;

  await updateGroup(props.group.id, { title });

  editingGroup.value = false;

  emit("refresh");
};

const removeGroup = async () => {
  const confirmed = window.confirm(
    `Delete "${props.group.title}" and all its items?`,
  );

  if (!confirmed) return;

  await deleteGroup(props.group.id);

  emit("refresh");
};

const localItems = ref([...props.group.items]);

watch(
  () => props.group.items,
  (value) => {
    localItems.value = [...value];
  },
  { deep: true },
);

const addItem = async () => {
  const title = newItem.value.trim();
  if (!title) return;

  adding.value = true;

  try {
    await createItem(props.group.id, title);
    newItem.value = "";
    emit("refresh");
  } finally {
    adding.value = false;
  }
};

const saveItemsOrder = async () => {
  const payload = localItems.value.map((item, index) => ({
    id: item.id,
    sortOrder: (index + 1) * 100,
  }));

  try {
    await reorderItems(payload);

    emit("refresh");
  } catch {
    emit("refresh");
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-grip-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            class="group-drag-handle cursor-grab active:cursor-grabbing"
            aria-label="Reorder group"
          />

          <div
            class="flex size-9 items-center justify-center rounded-lg bg-elevated"
          >
            <UIcon :name="`i-lucide-${group.icon}`" class="size-5" />
          </div>

          <div>
            <form
              v-if="editingGroup"
              class="flex items-center gap-2"
              @submit.prevent="saveGroup"
            >
              <UInput v-model="groupTitle" autofocus size="sm" />
              <UButton type="submit" icon="i-lucide-check" size="xs" />
            </form>

            <h2 v-else class="font-semibold">
              {{ group.title }}
            </h2>

            <p class="text-xs text-muted">
              {{ group.items.filter((item) => item.completed).length }}
              /
              {{ group.items.length }}
              completed
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="editingGroup = true"
          />

          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="xs"
            @click="removeGroup"
          />
        </div>
      </div>
    </template>

    <div class="space-y-2">
      <VueDraggable
        v-model="localItems"
        handle=".item-drag-handle"
        :animation="180"
        @end="saveItemsOrder"
      >
        <ChecklistItem
          v-for="item in localItems"
          :key="item.id"
          :item="item"
          @refresh="emit('refresh')"
        />
      </VueDraggable>

      <form class="flex gap-2 pt-2" @submit.prevent="addItem">
        <UInput v-model="newItem" placeholder="Add item..." class="flex-1" />
        <UButton type="submit" icon="i-lucide-plus" :loading="adding">
          Add
        </UButton>
      </form>
    </div>
  </UCard>
</template>
