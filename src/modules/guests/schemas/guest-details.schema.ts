import { z } from "zod";

const MAX_SEATS = 20;

const optionalPhone = z
  .string()
  .trim()
  .regex(/^[\d\s()+-]{8,20}$/)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const guestDetailsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: optionalPhone,
  seats: z.coerce.number().int().min(1).max(MAX_SEATS),
});

export const guestIdSchema = z.object({ guestId: z.uuid() });

export const updateGuestSchema = guestDetailsSchema.extend({ guestId: z.uuid() });

export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;
