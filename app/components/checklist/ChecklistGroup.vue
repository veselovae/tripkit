<script setup lang="ts">
const { t } = useI18n();
import type { ChecklistGroupWithItems } from "~~/shared/types/checklist";
import { VueDraggable } from "vue-draggable-plus";

const props = defineProps<{ group: ChecklistGroupWithItems }>();
const emit = defineEmits<{ refresh: [] }>();

const { createItem, updateGroup, deleteGroup, reorderItems } = useChecklist();

const toast = useToast();

const newItem = ref("");
const adding = ref(false);
const editingGroup = ref(false);
const groupTitle = ref(props.group.title);
const savingGroup = ref(false);
const deleteDialogOpen = ref(false);
const deletingGroup = ref(false);
const localItems = ref([...props.group.items]);

watch(
  () => props.group.title,
  (value) => {
    groupTitle.value = value;
  },
);

watch(
  () => props.group.items,
  (value) => {
    localItems.value = [...value];
  },
  { deep: true },
);

const startEditingGroup = () => {
  groupTitle.value = props.group.title;
  editingGroup.value = true;
};

const cancelEditingGroup = () => {
  groupTitle.value = props.group.title;
  editingGroup.value = false;
};

const saveGroup = async () => {
  const title = groupTitle.value.trim();

  if (!title) return;

  savingGroup.value = true;

  try {
    await updateGroup(props.group.id, {
      title,
    });

    editingGroup.value = false;

    toast.add({ title: t('checklist.groupUpdated'), icon: "i-lucide-check" });

    emit("refresh");
  } catch {
    toast.add({
      title: t('checklist.groupUpdateError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    savingGroup.value = false;
  }
};

const addItem = async () => {
  const title = newItem.value.trim();

  if (!title) return;

  adding.value = true;

  try {
    await createItem(props.group.id, title);

    newItem.value = "";

    toast.add({ title: t('checklist.itemAdded'), icon: "i-lucide-plus" });

    emit("refresh");
  } catch {
    toast.add({
      title: t('checklist.itemAddError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    adding.value = false;
  }
};

const confirmDeleteGroup = async () => {
  deletingGroup.value = true;

  try {
    await deleteGroup(props.group.id);

    deleteDialogOpen.value = false;

    toast.add({ title: t('checklist.groupDeleted'), icon: "i-lucide-trash-2" });

    emit("refresh");
  } catch {
    toast.add({
      title: t('checklist.groupDeleteError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    deletingGroup.value = false;
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
    toast.add({
      title: t('checklist.orderError'),
      color: "error",
      icon: "i-lucide-circle-alert",
    });

    emit("refresh");
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-start gap-3">
          <UButton
            icon="
              i-lucide-grip-vertical
            "
            color="neutral"
            variant="ghost"
            size="xs"
            class="group-drag-handle mt-1 cursor-grab active:cursor-grabbing"
            :aria-label="t('checklist.reorderGroup')"
          />

          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated"
          >
            <UIcon :name="`i-lucide-${group.icon}`" class="size-5" />
          </div>

          <div class="min-w-0">
            <form
              v-if="editingGroup"
              class="flex items-center gap-2"
              @submit.prevent="saveGroup"
            >
              <UInput v-model="groupTitle" autofocus size="sm" />

              <UButton
                type="submit"
                icon="
                  i-lucide-check
                "
                size="xs"
                :loading="savingGroup"
              />

              <UButton
                type="button"
                icon="
                  i-lucide-x
                "
                size="xs"
                color="neutral"
                variant="ghost"
                :disabled="savingGroup"
                @click="cancelEditingGroup"
              />
            </form>

            <h2 v-else class="truncate font-semibold">
              {{ group.title }}
            </h2>

            <p class="mt-1 text-xs text-muted">
              {{ t('checklist.completed', { completed: localItems.filter((item) => item.completed).length, total: localItems.length }) }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 gap-1">
          <UButton
            icon="
              i-lucide-pencil
            "
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t('checklist.editGroup')"
            @click="startEditingGroup"
          />

          <UButton
            icon="
              i-lucide-trash-2
            "
            color="error"
            variant="ghost"
            size="xs"
            :aria-label="t('checklist.deleteGroup')"
            @click="deleteDialogOpen = true"
          />
        </div>
      </div>
    </template>

    <VueDraggable
      v-model="localItems"
      handle="
        .item-drag-handle
      "
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

    <form
      class="mt-3 flex gap-2 border-t border-default pt-4"
      @submit.prevent="addItem"
    >
      <UInput v-model="newItem" :placeholder="t('checklist.itemPlaceholder')" class="flex-1" />

      <UButton type="submit" icon="i-lucide-plus" :loading="adding">{{ t('common.add') }}</UButton>
    </form>

    <ConfirmDialog
      v-model:open="deleteDialogOpen"
      :title="t('checklist.deleteGroupTitle')"
      :description="t('checklist.deleteGroupDescription', { title: group.title })"
      :confirm-label="t('checklist.deleteGroup')"
      :loading="deletingGroup"
      @confirm="confirmDeleteGroup"
    />
  </UCard>
</template>
