import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const giftKindEnum = pgEnum("gift_kind", ["item", "experience"]);
export const giftModeEnum = pgEnum("gift_mode", ["single", "fixed_quotas", "free_amount"]);

export const giftCategories = pgTable("gift_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const gifts = pgTable(
  "gifts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => giftCategories.id),
    kind: giftKindEnum("kind").notNull().default("item"),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url"),
    imagePublicId: text("image_public_id"),
    priceCents: integer("price_cents").notNull(),
    mode: giftModeEnum("mode").notNull().default("single"),
    totalQuotas: integer("total_quotas"),
    minAmountCents: integer("min_amount_cents"),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("gifts_category_visible_idx").on(table.categoryId, table.isVisible)],
);
