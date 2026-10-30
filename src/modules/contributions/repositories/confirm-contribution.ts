import { and, eq } from "drizzle-orm";
import { giftContributions, guests, messages } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { ConfirmationInput, Contribution } from "../types";

export async function confirmContribution(
  database: Database,
  { contributionId, confirmedBy, confirmedAt, message }: ConfirmationInput,
): Promise<Contribution | null> {
  const [contribution] = await database
    .update(giftContributions)
    .set({ status: "confirmed", confirmedBy, confirmedAt })
    .where(and(eq(giftContributions.id, contributionId), eq(giftContributions.status, "reserved")))
    .returning();
  if (!contribution || !message) return contribution ?? null;
  const [guest] = await database
    .select({ name: guests.name })
    .from(guests)
    .where(eq(guests.id, contribution.guestId))
    .limit(1);
  await database.insert(messages).values({
    guestId: contribution.guestId,
    authorName: guest?.name ?? "Convidado",
    body: message,
    status: "pending",
    contributionId: contribution.id,
  });
  return contribution;
}
