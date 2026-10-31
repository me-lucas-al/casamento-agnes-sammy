import { getGiftModule, type GiftModule } from "@/modules/gifts/factory";
import { logger } from "@/shared/lib/logger";
import { GIFT_SUGGESTION_CATALOG } from "./data/gift-suggestion-catalog";
import { createGiftModuleGateway } from "./gateways/gift-module-gateway";
import { makeAddSuggestedGifts } from "./use-cases/add-suggested-gifts";
import { makeGetSuggestionsPromptStatus } from "./use-cases/get-suggestions-prompt-status";
import { makeListSuggestionsWithStatus } from "./use-cases/list-suggestions-with-status";
import type { GiftSuggestion } from "./types";

export type GiftSuggestionModuleOptions = {
  catalog?: readonly GiftSuggestion[];
};

export function createGiftSuggestionModule(giftModule: GiftModule, options: GiftSuggestionModuleOptions = {}) {
  const { catalog = GIFT_SUGGESTION_CATALOG } = options;
  const gateway = createGiftModuleGateway(giftModule);
  return {
    listSuggestionsWithStatus: makeListSuggestionsWithStatus({ gateway, catalog }),
    addSuggestedGifts: makeAddSuggestedGifts({ gateway, catalog, logger }),
    getSuggestionsPromptStatus: makeGetSuggestionsPromptStatus({ gateway }),
  };
}

export type GiftSuggestionModule = ReturnType<typeof createGiftSuggestionModule>;

export function getGiftSuggestionModule(): GiftSuggestionModule {
  return createGiftSuggestionModule(getGiftModule());
}
