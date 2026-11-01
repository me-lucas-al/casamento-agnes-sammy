"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { describeGiftError } from "@/modules/gifts/errors";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { getGiftSuggestionModule } from "@/modules/gift-suggestions/factory";
import { invalidateSuggestionCaches } from "@/modules/gift-suggestions/lib/caches/invalidate-suggestion-caches";
import { addSuggestionsSchema } from "@/modules/gift-suggestions/schemas/add-suggestions.schema";
import type { AddSuggestionsResult } from "@/modules/gift-suggestions/types";

export async function addSuggestedGiftsAction(input: unknown): Promise<ActionResult<AddSuggestionsResult>> {
  const parsed = addSuggestionsSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    const result = await getGiftSuggestionModule().addSuggestedGifts(actor, parsed.data.suggestionIds);
    if (result.createdCount + result.enrichedCount > 0) invalidateSuggestionCaches(nextCacheInvalidator);
    return success(result);
  }, "addSuggestedGiftsAction");
}
