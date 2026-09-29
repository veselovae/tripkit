import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTripSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Trip name must contain at least 2 characters")
      .max(150),

    destination: z.string().trim().min(2, "Destination is required").max(200),

    startDate: z.string().regex(isoDateRegex, "Invalid start date"),

    endDate: z.string().regex(isoDateRegex, "Invalid end date"),

    description: z.string().trim().max(5000).optional().default(""),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export const updateTripSchema = createTripSchema;

export type CreateTripInput = z.infer<typeof createTripSchema>;

export type UpdateTripInput = z.infer<typeof updateTripSchema>;
