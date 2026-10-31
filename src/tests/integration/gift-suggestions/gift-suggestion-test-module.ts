import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import { createGiftSuggestionModule } from "@/modules/gift-suggestions/factory";
import { parseSuggestionQuery } from "@/modules/gift-suggestions/schemas/suggestion-query-params";
import type { SearchParams } from "@/shared/lib/url-params";
import type { Database } from "@/shared/db/types";
import { createTestGiftModule } from "../gifts/gift-test-module";

export function createTestSuggestionModule(db: Database) {
  const { giftModule } = createTestGiftModule(db);
  return { giftModule, suggestionModule: createGiftSuggestionModule(giftModule) };
}

export function idOf(suggestionName: string): string {
  const suggestion = GIFT_SUGGESTION_CATALOG.find((candidate) => candidate.name === suggestionName);
  if (!suggestion) throw new Error(`Unknown suggestion ${suggestionName}`);
  return suggestion.id;
}

export function queryOf(searchParams: SearchParams = {}) {
  return parseSuggestionQuery(searchParams);
}
