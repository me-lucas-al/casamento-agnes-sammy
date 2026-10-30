import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { guests } from "@/modules/guests/schema";

export const rsvpStatusEnum = pgEnum("rsvp_status", ["pending", "going", "declined"]);

export const rsvps = pgTable("rsvps", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: uuid("guest_id")
    .notNull()
    .unique()
    .references(() => guests.id, { onDelete: "cascade" }),
  status: rsvpStatusEnum("status").notNull().default("pending"),
  dietaryNote: text("dietary_note"),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
});

export const rsvpCompanions = pgTable("rsvp_companions", {
  id: uuid("id").defaultRandom().primaryKey(),
  guestId: uuid("guest_id")
    .notNull()
    .references(() => guests.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dietaryNote: text("dietary_note"),
});
