export type AccommodationType =
  | "hotel"
  | "apartment"
  | "hostel"
  | "house"
  | "resort"
  | "other";

export interface Accommodation {
  id: string;
  ownerId: string;
  tripId: string;
  type: AccommodationType;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  bookingReference: string;
  phone: string;
  website: string;
  notes: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
