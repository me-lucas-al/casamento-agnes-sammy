"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeGiftError } from "../errors";
import { getGiftModule } from "../factory";
import { invalidateGiftCaches } from "../lib/invalidate-gift-caches";
import { giftIdSchema, giftSchema } from "../schemas/gift.schema";

export async function createGiftAction(input: unknown): Promise<ActionResult<{ giftId: string }>> {
  const parsed = giftSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    const gift = await getGiftModule().createGift(actor, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator, gift.id);
    return success({ giftId: gift.id });
  }, "createGiftAction");
}

export async function updateGiftAction(giftId: unknown, input: unknown): Promise<ActionResult> {
  const parsedId = giftIdSchema.safeParse(giftId);
  const parsed = giftSchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return invalidInput(parsedId, parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    await getGiftModule().updateGift(actor, parsedId.data, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator, parsedId.data);
    return success();
  }, "updateGiftAction");
}

export async function deleteGiftAction(giftId: unknown): Promise<ActionResult> {
  const parsedId = giftIdSchema.safeParse(giftId);
  if (!parsedId.success) return invalidInput(parsedId);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    await getGiftModule().deleteGift(actor, parsedId.data);
    invalidateGiftCaches(nextCacheInvalidator, parsedId.data);
    return success();
  }, "deleteGiftAction");
}
