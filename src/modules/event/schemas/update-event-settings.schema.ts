import { z } from "zod";
import { parseSaoPauloLocalDateTime } from "../lib/sao-paulo-local-datetime";

const PIX_KEY_TYPES = ["cpf", "cnpj", "email", "phone", "random"] as const;

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value === "" ? null : value));

const localDateTime = z
  .string()
  .transform((value, context) => {
    const date = parseSaoPauloLocalDateTime(value);
    if (date) return date;
    context.addIssue({ code: "custom", message: "Data inválida" });
    return z.NEVER;
  });

const optionalLocalDateTime = z
  .string()
  .transform((value, context) => {
    if (value === "") return null;
    const date = parseSaoPauloLocalDateTime(value);
    if (date) return date;
    context.addIssue({ code: "custom", message: "Data inválida" });
    return z.NEVER;
  });

const optionalUrl = optionalText(500).refine(
  (value) => value === null || /^https?:\/\//i.test(value),
  "URL inválida",
);

const optionalPixKeyType = z
  .union([z.enum(PIX_KEY_TYPES), z.literal("")])
  .transform((value) => (value === "" ? null : value));

export const updateEventSettingsSchema = z.object({
  coupleNames: z.string().trim().min(2).max(120),
  eventAt: localDateTime,
  venueName: z.string().trim().min(2).max(160),
  address: z.string().trim().min(2).max(300),
  mapUrl: optionalUrl,
  story: optionalText(5000),
  rsvpDeadline: optionalLocalDateTime,
  pixKey: optionalText(120),
  pixKeyType: optionalPixKeyType,
  pixReceiverName: optionalText(25),
  pixCity: optionalText(15),
});
