<script setup lang="ts">
import type { ChecklistItem } from "~~/shared/types/checklist";

const props = defineProps<{ item: ChecklistItem }>();
const emit = defineEmits<{ refresh: [] }>();

const { updateItem, deleteItem } = useChecklist();

const editing = ref(false);
const title = ref(props.item.title);

watch(
  () => props.item.title,
  (value) => {
    title.value = value;
  },
);

const localCompleted = ref(props.item.completed);

watch(
  () => props.item.completed,
  (value) => {
    localCompleted.value = value;
  },
);

const save = async () => {
  const value = title.value.trim();

  if (!value) return;

  await updateItem(props.item.id, {
    title: value,
  });

  editing.value = false;

  emit("refresh");
};

const toggle = async (completed: boolean) => {
  const previous = localCompleted.value;
  localCompleted.value = completed;

  try {
    await updateItem(props.item.id, { completed });
    emit("refresh");
  } catch {
    localCompleted.value = previous;
  }
};

const remove = async () => {
  await deleteItem(props.item.id);

  emit("refresh");
};
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-elevated">
    <UButton
      icon="i-lucide-grip-vertical"
      color="neutral"
      variant="ghost"
      size="xs"
      class="item-drag-handle cursor-grab active:cursor-grabbing"
      aria-label="Reorder item"
    />

    <UCheckbox
      :model-value="localCompleted"
      @update:model-value="toggle(Boolean($event))"
    />

    <form v-if="editing" class="flex flex-1 gap-2" @submit.prevent="save">
      <UInput v-model="title" size="sm" autofocus class="flex-1" />
      <UButton type="submit" icon="i-lucide-check" size="xs" />
    </form>

    <template v-else>
      <span
        class="flex-1 text-sm"
        :class="{ 'text-muted line-through': item.completed }"
      >
        {{ item.title }}
      </span>

      <UButton
        icon="i-lucide-pencil"
        color="neutral"
        variant="ghost"
        size="xs"
        aria-label="Edit item"
        @click="editing = true"
      />

      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="xs"
        aria-label="Delete item"
        @click="remove"
      />
    </template>
  </div>
</template>
