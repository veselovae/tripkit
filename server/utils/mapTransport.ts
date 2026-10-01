import type { Transport } from "~~/shared/types/transport";

export const mapTransport = (row: any): Transport => ({
  id: row.$id,
  ownerId: row.ownerId,
  tripId: row.tripId,
  type: row.type,
  provider: row.provider ?? "",
  number: row.number ?? "",
  departureLocation: row.departureLocation,
  arrivalLocation: row.arrivalLocation,
  departureAt: row.departureAt,
  arrivalAt: row.arrivalAt ?? null,
  departureTerminal: row.departureTerminal ?? "",
  arrivalTerminal: row.arrivalTerminal ?? "",
  seat: row.seat ?? "",
  bookingReference: row.bookingReference ?? "",
  notes: row.notes ?? "",
  sortOrder: row.sortOrder,
  createdAt: row.$createdAt,
  updatedAt: row.$updatedAt,
});
