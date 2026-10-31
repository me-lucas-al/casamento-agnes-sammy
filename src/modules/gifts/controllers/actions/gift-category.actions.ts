"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describeGiftError } from "@/modules/gifts/errors";
import { getGiftModule } from "@/modules/gifts/factory";
import { invalidateGiftCaches } from "@/modules/gifts/lib/caches/invalidate-gift-caches";
import { giftCategoryIdSchema, giftCategorySchema } from "@/modules/gifts/schemas/gift-category.schema";

export async function createGiftCategoryAction(input: unknown): Promise<ActionResult<{ categoryId: string }>> {
  const parsed = giftCategorySchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    const category = await getGiftModule().createGiftCategory(actor, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success({ categoryId: category.id });
  }, "createGiftCategoryAction");
}

export async function updateGiftCategoryAction(categoryId: unknown, input: unknown): Promise<ActionResult> {
  const parsedId = giftCategoryIdSchema.safeParse(categoryId);
  const parsed = giftCategorySchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return invalidInput(parsedId, parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    await getGiftModule().updateGiftCategory(actor, parsedId.data, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success();
  }, "updateGiftCategoryAction");
}

export async function deleteGiftCategoryAction(categoryId: unknown): Promise<ActionResult> {
  const parsedId = giftCategoryIdSchema.safeParse(categoryId);
  if (!parsedId.success) return invalidInput(parsedId);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    await getGiftModule().deleteGiftCategory(actor, parsedId.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success();
  }, "deleteGiftCategoryAction");
}
