import { and, eq, ne } from "drizzle-orm";
import { gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";

export async function existsGiftWithImagePublicId(
  database: Database,
  publicId: string,
  excludedGiftId?: string,
): Promise<boolean> {
  const sameAsset = eq(gifts.imagePublicId, publicId);
  const filter = excludedGiftId ? and(sameAsset, ne(gifts.id, excludedGiftId)) : sameAsset;
  const [row] = await database.select({ id: gifts.id }).from(gifts).where(filter).limit(1);
  return row !== undefined;
}
