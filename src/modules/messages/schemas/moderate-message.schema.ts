import { z } from "zod";

export const moderateMessageSchema = z.object({
  messageId: z.uuid(),
  decision: z.enum(["approved", "rejected"]),
});
