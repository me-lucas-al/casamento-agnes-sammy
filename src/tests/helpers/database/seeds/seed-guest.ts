import { randomInt } from "node:crypto";
import { guests } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { seedAdmin } from "./seed-user";

type GuestOverrides = Partial<typeof guests.$inferInsert>;

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

function generateCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

export async function seedGuest(db: Database, overrides: GuestOverrides = {}) {
  const createdBy = overrides.createdBy ?? (await seedAdmin(db)).id;
  const [guest] = await db
    .insert(guests)
    .values({ name: "Test Guest", code: generateCode(), seats: 1, ...overrides, createdBy })
    .returning();
  return guest;
}
