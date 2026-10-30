"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeGiftError } from "../errors";
import { getGiftModule } from "../factory";
import { invalidateGiftCaches } from "../lib/invalidate-gift-caches";
import { giftCategoryIdSchema, giftCategorySchema } from "../schemas/gift-category.schema";

export async function createGiftCategoryAction(input: unknown): Promise<ActionResult<{ categoryId: string }>> {
  const parsed = giftCategorySchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    const category = await getGiftModule().createGiftCategory(actor, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success({ categoryId: category.id });
  } catch (error) {
    return failure(describeGiftError(error));
  }
}

export async function updateGiftCategoryAction(categoryId: unknown, input: unknown): Promise<ActionResult> {
  const parsedId = giftCategoryIdSchema.safeParse(categoryId);
  const parsed = giftCategorySchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getGiftModule().updateGiftCategory(actor, parsedId.data, parsed.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success();
  } catch (error) {
    return failure(describeGiftError(error));
  }
}

export async function deleteGiftCategoryAction(categoryId: unknown): Promise<ActionResult> {
  const parsedId = giftCategoryIdSchema.safeParse(categoryId);
  if (!parsedId.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getGiftModule().deleteGiftCategory(actor, parsedId.data);
    invalidateGiftCaches(nextCacheInvalidator);
    return success();
  } catch (error) {
    return failure(describeGiftError(error));
  }
}
