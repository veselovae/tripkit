import type { Transport } from "~~/shared/types/transport";

import type { Accommodation } from "~~/shared/types/accommodation";

import type {
  CreateTransportInput,
  UpdateTransportInput,
} from "~~/shared/schemas/transport";

import type {
  CreateAccommodationInput,
  UpdateAccommodationInput,
} from "~~/shared/schemas/accommodation";

export const useBookings = () => {
  const createTransport = (tripId: string, input: CreateTransportInput) => {
    return $fetch<Transport>(`/api/trips/${tripId}/bookings/transport`, {
      method: "POST",
      body: input,
    });
  };

  const updateTransport = (id: string, input: UpdateTransportInput) => {
    return $fetch<Transport>(`/api/bookings/transport/${id}`, {
      method: "PATCH",
      body: input,
    });
  };

  const deleteTransport = (id: string) => {
    return $fetch(`/api/bookings/transport/${id}`, {
      method: "DELETE",
    });
  };

  const createAccommodation = (
    tripId: string,
    input: CreateAccommodationInput,
  ) => {
    return $fetch<Accommodation>(
      `/api/trips/${tripId}/bookings/accommodation`,
      {
        method: "POST",
        body: input,
      },
    );
  };

  const updateAccommodation = (id: string, input: UpdateAccommodationInput) => {
    return $fetch<Accommodation>(`/api/bookings/accommodation/${id}`, {
      method: "PATCH",
      body: input,
    });
  };

  const deleteAccommodation = (id: string) => {
    return $fetch(`/api/bookings/accommodation/${id}`, {
      method: "DELETE",
    });
  };

  return {
    createTransport,
    updateTransport,
    deleteTransport,

    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
  };
};
