import { z } from "zod";

export const transportTypes = [
  "flight",
  "train",
  "bus",
  "ferry",
  "car",
  "other",
] as const;

export const createTransportSchema = z
  .object({
    type: z.enum(transportTypes),
    provider: z.string().trim().max(150).optional().default(""),
    number: z.string().trim().max(100).optional().default(""),
    departureLocation: z
      .string()
      .trim()
      .min(1, "Departure location is required")
      .max(250),
    arrivalLocation: z
      .string()
      .trim()
      .min(1, "Arrival location is required")
      .max(250),
    departureAt: z.string().datetime(),
    arrivalAt: z.string().datetime().nullable().optional().default(null),
    departureTerminal: z.string().trim().max(100).optional().default(""),
    arrivalTerminal: z.string().trim().max(100).optional().default(""),
    seat: z.string().trim().max(100).optional().default(""),
    bookingReference: z.string().trim().max(150).optional().default(""),
    notes: z.string().trim().max(5000).optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.arrivalAt) return true;
      return new Date(data.arrivalAt) >= new Date(data.departureAt);
    },
    {
      message: "Arrival cannot be before departure",
      path: ["arrivalAt"],
    },
  );

export const updateTransportSchema = createTransportSchema;

export type CreateTransportInput = z.infer<typeof createTransportSchema>;

export type UpdateTransportInput = z.infer<typeof updateTransportSchema>;
