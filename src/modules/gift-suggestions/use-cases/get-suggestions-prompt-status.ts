import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { SuggestionGiftGateway } from "../ports";

export const FEW_GIFTS_THRESHOLD = 5;

export type SuggestionsPromptStatus = {
  giftCount: number;
  shouldPromote: boolean;
};

type Dependencies = { gateway: SuggestionGiftGateway };

export function makeGetSuggestionsPromptStatus({ gateway }: Dependencies) {
  return async function getSuggestionsPromptStatus(actor: SessionUser | null): Promise<SuggestionsPromptStatus> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const giftCount = (await gateway.listGiftNames()).length;
    return { giftCount, shouldPromote: giftCount < FEW_GIFTS_THRESHOLD };
  };
}
