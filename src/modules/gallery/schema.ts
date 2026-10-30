import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { guests } from "@/modules/guests/schema";
import { moderationStatusEnum } from "@/modules/messages/schema";
import { users } from "@/modules/users/schema";

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cloudinaryPublicId: text("cloudinary_public_id").notNull(),
    url: text("url").notNull(),
    caption: text("caption"),
    uploadedByUserId: uuid("uploaded_by_user_id").references(() => users.id),
    uploadedByGuestId: uuid("uploaded_by_guest_id").references(() => guests.id),
    status: moderationStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("photos_status_idx").on(table.status)],
);
