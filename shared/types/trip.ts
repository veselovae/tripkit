export interface Trip {
  id: string;

  ownerId: string;

  title: string;
  destination: string;

  startDate: string;
  endDate: string;

  description: string;
  coverFileId: string | null;

  createdAt: string;
  updatedAt: string;
}
