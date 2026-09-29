import type { Trip } from "~~/shared/types/trip";

export const mapTrip = (row: any): Trip => ({
  id: row.$id,

  ownerId: row.ownerId,

  title: row.title,
  destination: row.destination,

  startDate: row.startDate,
  endDate: row.endDate,

  description: row.description ?? "",
  coverFileId: row.coverFileId ?? null,

  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
});
