import type { ChecklistGroup, ChecklistItem } from "~~/shared/types/checklist";

export const mapChecklistGroup = (row: any): ChecklistGroup => ({
  id: row.$id,
  ownerId: row.ownerId,
  tripId: row.tripId,

  title: row.title,
  icon: row.icon,
  sortOrder: row.sortOrder,

  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
});

export const mapChecklistItem = (row: any): ChecklistItem => ({
  id: row.$id,
  ownerId: row.ownerId,
  tripId: row.tripId,
  groupId: row.groupId,

  title: row.title,
  completed: row.completed,
  note: row.note ?? "",
  sortOrder: row.sortOrder,

  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
});
