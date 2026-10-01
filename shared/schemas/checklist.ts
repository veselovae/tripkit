import { z } from "zod";

export const createChecklistGroupSchema = z.object({
  title: z.string().trim().min(1, "Group name is required").max(100),
  icon: z.string().trim().min(1).max(100),
});

export const updateChecklistGroupSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  icon: z.string().trim().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
});

export const createChecklistItemSchema = z.object({
  title: z.string().trim().min(1, "Item name is required").max(200),
  note: z.string().trim().max(2000).optional().default(""),
});

export const updateChecklistItemSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional(),
  note: z.string().trim().max(2000).optional(),
  sortOrder: z.number().int().optional(),
});
