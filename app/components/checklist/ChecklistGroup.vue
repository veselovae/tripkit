<script setup lang="ts">
import { useChecklist } from "~/composables/useChecklist";
import type { ChecklistGroupWithItems } from "~~/shared/types/checklist";

const props = defineProps<{ group: ChecklistGroupWithItems }>();
const emit = defineEmits<{ refresh: [] }>();

const { createItem, updateItem, deleteItem, deleteGroup } = useChecklist();

const newItem = ref("");
const adding = ref(false);

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

const toggleItem = async (itemId: string, completed: boolean) => {
  await updateItem(itemId, { completed });

  emit("refresh");
};

const removeItem = async (itemId: string) => {
  await deleteItem(itemId);

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
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            class="flex size-9 items-center justify-center rounded-lg bg-elevated"
          >
            <UIcon :name="`i-lucide-${group.icon}`" class="size-5" />
          </div>

          <div>
            <h2 class="font-semibold">
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

        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          aria-label="Delete group"
          @click="removeGroup"
        />
      </div>
    </template>

    <div class="space-y-2">
      <div
        v-for="item in group.items"
        :key="item.id"
        class="group/item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-elevated"
      >
        <UCheckbox
          :model-value="item.completed"
          @update:model-value="toggleItem(item.id, Boolean($event))"
        />

        <span
          class="flex-1 text-sm"
          :class="{
            'text-muted line-through': item.completed,
          }"
        >
          {{ item.title }}
        </span>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Delete item"
          @click="removeItem(item.id)"
        />
      </div>

      <form class="flex gap-2 pt-2" @submit.prevent="addItem">
        <UInput v-model="newItem" placeholder="Add item..." class="flex-1" />

        <UButton type="submit" icon="i-lucide-plus" :loading="adding">
          Add
        </UButton>
      </form>
    </div>
  </UCard>
</template>
