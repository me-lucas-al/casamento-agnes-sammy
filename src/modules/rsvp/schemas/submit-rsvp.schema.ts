import { z } from "zod";

const companionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  dietaryNote: z.string().trim().max(200).nullish().transform((note) => note || null),
});

export const submitRsvpSchema = z.object({
  status: z.enum(["going", "declined"]),
  dietaryNote: z.string().trim().max(200).nullish().transform((note) => note || null),
  companions: z.array(companionSchema).max(20).default([]),
});

export const submitRsvpForGuestSchema = submitRsvpSchema.extend({
  guestId: z.uuid(),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
