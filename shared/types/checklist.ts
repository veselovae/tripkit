export interface ChecklistGroup {
  id: string;
  ownerId: string;
  tripId: string;

  title: string;
  icon: string;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  ownerId: string;
  tripId: string;
  groupId: string;

  title: string;
  completed: boolean;
  note: string;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

export interface ChecklistGroupWithItems extends ChecklistGroup {
  items: ChecklistItem[];
}
