import type { Trip } from "./trip";
import type { Transport } from "./transport";
import type { Accommodation } from "./accommodation";

export interface TripOverview {
  trip: Trip;
  checklist: {
    total: number;
    completed: number;
    progress: number;
  };
  nextTransport: Transport | null;
  accommodation: Accommodation | null;
}
