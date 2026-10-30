import { z } from "zod";
import { MAX_AUTHOR_NAME_LENGTH, MAX_BODY_LENGTH } from "../lib/sanitize-message";

export const sendMessageSchema = z.object({
  authorName: z.string().trim().min(1).max(MAX_AUTHOR_NAME_LENGTH),
  body: z.string().trim().min(1).max(MAX_BODY_LENGTH),
});
