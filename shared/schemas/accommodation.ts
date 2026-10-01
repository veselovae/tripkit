import { z } from "zod";

export const accommodationTypes = [
  "hotel",
  "apartment",
  "hostel",
  "house",
  "resort",
  "other",
] as const;

export const createAccommodationSchema = z
  .object({
    type: z.enum(accommodationTypes),
    name: z.string().trim().min(1, "Name is required").max(200),
    address: z.string().trim().max(500).optional().default(""),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    bookingReference: z.string().trim().max(150).optional().default(""),
    phone: z.string().trim().max(100).optional().default(""),
    website: z
      .union([z.string().url(), z.literal("")])
      .optional()
      .default(""),

    notes: z.string().trim().max(5000).optional().default(""),
  })
  .refine((data) => new Date(data.checkOut) >= new Date(data.checkIn), {
    message: "Check-out cannot be before check-in",
    path: ["checkOut"],
  });

export const updateAccommodationSchema = createAccommodationSchema;

export type CreateAccommodationInput = z.infer<
  typeof createAccommodationSchema
>;

export type UpdateAccommodationInput = z.infer<
  typeof updateAccommodationSchema
>;
