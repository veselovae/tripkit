import type { Accommodation } from "~~/shared/types/accommodation";

export const mapAccommodation = (row: any): Accommodation => ({
  id: row.$id,
  ownerId: row.ownerId,
  tripId: row.tripId,
  type: row.type,
  name: row.name,
  address: row.address ?? "",
  checkIn: row.checkIn,
  checkOut: row.checkOut,
  bookingReference: row.bookingReference ?? "",
  phone: row.phone ?? "",
  website: row.website ?? "",
  notes: row.notes ?? "",
  sortOrder: row.sortOrder,
  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
});
