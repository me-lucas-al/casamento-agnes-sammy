import { z } from "zod";

export const giftImageUploadSchema = z.object({
  contentType: z.string().min(1).max(100),
  sizeBytes: z.number().int().nonnegative(),
});
