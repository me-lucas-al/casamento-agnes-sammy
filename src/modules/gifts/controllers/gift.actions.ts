"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeGiftError } from "../errors";
import { getGiftModule } from "../factory";
import { invalidateGiftCaches } from "../lib/invalidate-gift-caches";
import { giftIdSchema, giftSchema } from "../schemas/gift.schema";

export async function createGiftAction(input: unknown): Promise<ActionResult<{ giftId: string }>> {
  const parsed = giftSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    const gift = await getGiftModule().createGift(actor, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator, gift.id);
    return success({ giftId: gift.id });
  } catch (error) {
    return failure(describeGiftError(error));
  }
}

export async function updateGiftAction(giftId: unknown, input: unknown): Promise<ActionResult> {
  const parsedId = giftIdSchema.safeParse(giftId);
  const parsed = giftSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getGiftModule().updateGift(actor, parsedId.data, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator, parsedId.data);
    return success();
  } catch (error) {
    return failure(describeGiftError(error));
  }
}

export async function deleteGiftAction(giftId: unknown): Promise<ActionResult> {
  const parsedId = giftIdSchema.safeParse(giftId);
  if (!parsedId.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getGiftModule().deleteGift(actor, parsedId.data);
    invalidateGiftCaches(nextCacheInvalidator, parsedId.data);
    return success();
  } catch (error) {
    return failure(describeGiftError(error));
  }
}
