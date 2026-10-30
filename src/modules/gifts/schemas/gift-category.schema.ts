import { z } from "zod";

export const giftCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  sortOrder: z.number().int().min(0).max(100_000).default(0),
});

export const giftCategoryIdSchema = z.uuid();
