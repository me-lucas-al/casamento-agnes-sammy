import { z } from "zod";

const MAX_MESSAGE_LENGTH = 500;

export const reserveGiftSchema = z.object({
  giftId: z.uuid(),
  quotas: z.number().int().positive().optional(),
  amountCents: z.number().int().positive().optional(),
  anonymous: z.boolean().optional(),
});

export const updateReservationSchema = reserveGiftSchema
  .omit({ giftId: true })
  .extend({ contributionId: z.uuid() });

export const contributionIdSchema = z.object({ contributionId: z.uuid() });

export const confirmPixPaymentSchema = contributionIdSchema.extend({
  message: z.string().trim().max(MAX_MESSAGE_LENGTH).optional(),
});
