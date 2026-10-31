import { and, asc, count, desc, eq, ne } from "drizzle-orm";
import { photos } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { PhotoSort } from "@/modules/gallery/types";
import type { PhotoRepository } from "../contracts/photo-repository";

function orderBySort(sort: PhotoSort) {
  if (sort === "oldest") return [asc(photos.createdAt), asc(photos.id)];
  return [desc(photos.createdAt), desc(photos.id)];
}

export function createDrizzlePhotoRepository(database: Database): PhotoRepository {
  return {
    async create(newPhoto) {
      const [photo] = await database.insert(photos).values(newPhoto).returning();
      return photo;
    },
    async findById(photoId) {
      const [photo] = await database.select().from(photos).where(eq(photos.id, photoId)).limit(1);
      return photo ?? null;
    },
    async updateStatus(photoId, status) {
      const [photo] = await database.update(photos).set({ status }).where(eq(photos.id, photoId)).returning();
      return photo ?? null;
    },
    async updateCaption(photoId, caption) {
      const [photo] = await database.update(photos).set({ caption }).where(eq(photos.id, photoId)).returning();
      return photo ?? null;
    },
    async deleteById(photoId) {
      await database.delete(photos).where(eq(photos.id, photoId));
    },
    async listApprovedPage({ limit, offset, sort }) {
      const filter = eq(photos.status, "approved");
      const [items, [totalRow]] = await Promise.all([
        database
          .select({ id: photos.id, url: photos.url, caption: photos.caption })
          .from(photos)
          .where(filter)
          .orderBy(...orderBySort(sort))
          .limit(limit)
          .offset(offset),
        database.select({ total: count() }).from(photos).where(filter),
      ]);
      return { items, total: totalRow?.total ?? 0 };
    },
    async listPanelPage({ limit, offset, status }) {
      const filter = status ? eq(photos.status, status) : undefined;
      const [items, [totalRow]] = await Promise.all([
        database
          .select()
          .from(photos)
          .where(filter)
          .orderBy(desc(photos.createdAt), desc(photos.id))
          .limit(limit)
          .offset(offset),
        database.select({ total: count() }).from(photos).where(filter),
      ]);
      return { items, total: totalRow?.total ?? 0 };
    },
    async existsWithPublicId(publicId, excludedPhotoId) {
      const sameAsset = eq(photos.cloudinaryPublicId, publicId);
      const filter = excludedPhotoId ? and(sameAsset, ne(photos.id, excludedPhotoId)) : sameAsset;
      const [row] = await database.select({ id: photos.id }).from(photos).where(filter).limit(1);
      return row !== undefined;
    },
    async countPendingByGuest(guestId) {
      const [row] = await database
        .select({ total: count() })
        .from(photos)
        .where(and(eq(photos.uploadedByGuestId, guestId), eq(photos.status, "pending")));
      return row?.total ?? 0;
    },
  };
}
