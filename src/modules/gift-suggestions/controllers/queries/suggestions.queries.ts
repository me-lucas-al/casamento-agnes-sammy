import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { getGiftSuggestionModule } from "@/modules/gift-suggestions/factory";
import { parseSuggestionQuery } from "@/modules/gift-suggestions/schemas/suggestion-query-params";

export async function listSuggestionsWithStatusQuery(searchParams: SearchParams) {
  return guardedQuery("listSuggestionsWithStatusQuery", async () => {
    const actor = await getSessionUser();
    return getGiftSuggestionModule().listSuggestionsWithStatus(actor, parseSuggestionQuery(searchParams));
  });
}

export async function getSuggestionsPromptStatusQuery() {
  return guardedQuery("getSuggestionsPromptStatusQuery", async () => {
    const actor = await getSessionUser();
    return getGiftSuggestionModule().getSuggestionsPromptStatus(actor);
  });
}
