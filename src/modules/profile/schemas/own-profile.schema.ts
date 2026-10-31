import { z } from "zod";
import { normalizeBrazilianPhone } from "../lib/brazilian-phone";

const relativeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  dietaryNote: z
    .string()
    .trim()
    .max(200)
    .nullish()
    .transform((note) => note || null),
});

export const ownProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .transform((rawPhone) => normalizeBrazilianPhone(rawPhone))
    .refine((phone): phone is string => phone !== null, "Telefone inválido"),
  email: z.string().trim().max(200).pipe(z.email()),
  relatives: z.array(relativeSchema).max(20).default([]),
});

export type OwnProfileInput = z.infer<typeof ownProfileSchema>;
