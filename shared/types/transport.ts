export type TransportType =
  | "flight"
  | "train"
  | "bus"
  | "ferry"
  | "car"
  | "other";

export interface Transport {
  id: string;
  ownerId: string;
  tripId: string;
  type: TransportType;
  provider: string;
  number: string;
  departureLocation: string;
  arrivalLocation: string;
  departureAt: string;
  arrivalAt: string | null;
  departureTerminal: string;
  arrivalTerminal: string;
  seat: string;
  bookingReference: string;
  notes: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
