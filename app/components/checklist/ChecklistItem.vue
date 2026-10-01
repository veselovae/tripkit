<script setup lang="ts">
import type { ChecklistItem } from "~~/shared/types/checklist";

const props = defineProps<{ item: ChecklistItem }>();
const emit = defineEmits<{ refresh: [] }>();

const { updateItem, deleteItem } = useChecklist();
const toast = useToast();

const editing = ref(false);
const title = ref(props.item.title);
const localCompleted = ref(props.item.completed);
const deleteDialogOpen = ref(false);
const deleting = ref(false);
const saving = ref(false);

watch(
  () => props.item.title,
  (value) => {
    title.value = value;
  },
);

watch(
  () => props.item.completed,
  (value) => {
    localCompleted.value = value;
  },
);

const startEditing = () => {
  title.value = props.item.title;
  editing.value = true;
};

const cancelEditing = () => {
  title.value = props.item.title;
  editing.value = false;
};

const save = async () => {
  const value = title.value.trim();

  if (!value) return;

  saving.value = true;

  try {
    await updateItem(props.item.id, { title: value });

    editing.value = false;

    toast.add({ title: "Item updated", icon: "i-lucide-check" });

    emit("refresh");
  } catch {
    toast.add({
      title: "Could not update item",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    saving.value = false;
  }
};

const toggle = async (completed: boolean) => {
  const previous = localCompleted.value;

  localCompleted.value = completed;

  try {
    await updateItem(props.item.id, { completed });
    emit("refresh");
  } catch {
    localCompleted.value = previous;

    toast.add({
      title: "Could not update checklist",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  }
};

const confirmDelete = async () => {
  deleting.value = true;

  try {
    await deleteItem(props.item.id);

    deleteDialogOpen.value = false;

    toast.add({ title: "Item deleted", icon: "i-lucide-trash-2" });

    emit("refresh");
  } catch {
    toast.add({
      title: "Could not delete item",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <div
    class="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-elevated"
  >
    <UButton
      icon="i-lucide-grip-vertical"
      color="neutral"
      variant="ghost"
      size="xs"
      class="item-drag-handle cursor-grab opacity-50 active:cursor-grabbing sm:opacity-0 sm:group-hover:opacity-100"
      aria-label="Reorder item"
    />

    <UCheckbox
      :model-value="localCompleted"
      @update:model-value="toggle(Boolean($event))"
    />

    <form
      v-if="editing"
      class="flex min-w-0 flex-1 gap-2"
      @submit.prevent="save"
    >
      <UInput v-model="title" autofocus size="sm" class="flex-1" />

      <UButton
        type="submit"
        icon="i-lucide-check"
        size="xs"
        :loading="saving"
        aria-label="Save item"
      />

      <UButton
        type="button"
        icon="i-lucide-x"
        size="xs"
        color="neutral"
        variant="ghost"
        :disabled="saving"
        aria-label="Cancel editing"
        @click="cancelEditing"
      />
    </form>

    <template v-else>
      <span
        class="min-w-0 flex-1 truncate text-sm"
        :class="{
          'text-muted line-through': localCompleted,
        }"
      >
        {{ item.title }}
      </span>

      <div
        class="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
      >
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Edit item"
          @click="startEditing"
        />

        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="xs"
          aria-label="Delete item"
          @click="deleteDialogOpen = true"
        />
      </div>
    </template>

    <ConfirmDialog
      v-model:open="deleteDialogOpen"
      title="Delete checklist item?"
      :description="`Delete &quot;${item.title}&quot; from this checklist?`"
      confirm-label="Delete item"
      :loading="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>
