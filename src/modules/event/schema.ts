import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pixKeyTypeEnum = pgEnum("pix_key_type", [
  "cpf",
  "cnpj",
  "email",
  "phone",
  "random",
]);

export const eventSettings = pgTable("event_settings", {
  id: integer("id").primaryKey().default(1),
  coupleNames: text("couple_names").notNull(),
  eventAt: timestamp("event_at", { withTimezone: true }).notNull(),
  venueName: text("venue_name").notNull(),
  address: text("address").notNull(),
  mapUrl: text("map_url"),
  story: text("story"),
  rsvpDeadline: timestamp("rsvp_deadline", { withTimezone: true }),
  pixKey: text("pix_key"),
  pixKeyType: pixKeyTypeEnum("pix_key_type"),
  pixReceiverName: text("pix_receiver_name"),
  pixCity: text("pix_city"),
});
