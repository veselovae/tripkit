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
    return $fetch(`/api/checklist/groups/${groupId}`, {
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
    return $fetch(`/api/checklist/items/${itemId}`, {
      method: "DELETE",
    });
  };

  return {
    createGroup,
    deleteGroup,

    createItem,
    updateItem,
    deleteItem,
  };
};
