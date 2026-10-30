import { boolean, index, integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { gifts } from "@/modules/gifts/schema";
import { guests } from "@/modules/guests/schema";
import { users } from "@/modules/users/schema";

export const contributionStatusEnum = pgEnum("contribution_status", [
  "reserved",
  "confirmed",
  "cancelled",
  "expired",
]);

export const giftContributions = pgTable(
  "gift_contributions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    giftId: uuid("gift_id")
      .notNull()
      .references(() => gifts.id),
    guestId: uuid("guest_id")
      .notNull()
      .references(() => guests.id),
    quotas: integer("quotas"),
    amountCents: integer("amount_cents").notNull(),
    anonymous: boolean("anonymous").notNull().default(false),
    status: contributionStatusEnum("status").notNull().default("reserved"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    confirmedBy: uuid("confirmed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("gift_contributions_gift_status_idx").on(table.giftId, table.status),
    index("gift_contributions_guest_idx").on(table.guestId),
  ],
);
