import type { ChecklistGroup, ChecklistItem } from "~~/shared/types/checklist";

export const useChecklist = () => {
  const createGroup = (
    tripId: string,
    input: {
      title: string;
      icon: string;
    },
  ) => {
    return $fetch<ChecklistGroup>(`/api/trips/${tripId}/checklist/groups`, {
      method: "POST",
      body: input,
    });
  };

  const deleteGroup = (groupId: string) => {
    return $fetch<{ success: boolean }>(`/api/checklist/groups/${groupId}`, {
      method: "DELETE",
    });
  };

  const createItem = (groupId: string, title: string) => {
    return $fetch<ChecklistItem>(`/api/checklist/groups/${groupId}/items`, {
      method: "POST",

      body: { title },
    });
  };

  const updateItem = (
    itemId: string,
    input: {
      title?: string;
      completed?: boolean;
      note?: string;
    },
  ) => {
    return $fetch<ChecklistItem>(`/api/checklist/items/${itemId}`, {
      method: "PATCH",
      body: input,
    });
  };

  const deleteItem = (itemId: string) => {
    return $fetch<{ success: boolean }>(`/api/checklist/items/${itemId}`, {
      method: "DELETE",
    });
  };

  const updateGroup = (
    groupId: string,
    input: {
      title?: string;
      icon?: string;
    },
  ) => {
    return $fetch<ChecklistGroup>(`/api/checklist/groups/${groupId}`, {
      method: "PATCH",
      body: input,
    });
  };

  const reorderGroups = (
    groups: Array<{
      id: string;
      sortOrder: number;
    }>,
  ) => {
    return $fetch("/api/checklist/groups/reorder", {
      method: "PATCH",
      body: { groups },
    });
  };

  const reorderItems = (
    items: Array<{
      id: string;
      sortOrder: number;
    }>,
  ) => {
    return $fetch("/api/checklist/items/reorder", {
      method: "PATCH",
      body: { items },
    });
  };

  const applyDefaultTemplate = (tripId: string) => {
    return $fetch(`/api/trips/${tripId}/checklist/template`, {
      method: "POST",
    });
  };

  return {
    createGroup,
    updateGroup,
    deleteGroup,

    createItem,
    updateItem,
    deleteItem,

    reorderGroups,
    reorderItems,

    applyDefaultTemplate,
  };
};
