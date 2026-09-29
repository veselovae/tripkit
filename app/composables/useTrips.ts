import type { Trip } from "~~/shared/types/trip";
import type { CreateTripInput, UpdateTripInput } from "~~/shared/schemas/trip";

export const useTrips = () => {
  const createTrip = (input: CreateTripInput) => {
    return $fetch<Trip>("/api/trips", {
      method: "POST",
      body: input,
    });
  };

  const updateTrip = (id: string, input: UpdateTripInput) => {
    return $fetch<Trip>(`/api/trips/${id}`, {
      method: "PATCH",
      body: input,
    });
  };

  const deleteTrip = (id: string) => {
    return $fetch(`/api/trips/${id}`, {
      method: "DELETE",
    });
  };

  return { createTrip, updateTrip, deleteTrip };
};
