import type { SessionUser } from "@/modules/auth/types";
import type { GiftInput } from "@/modules/gifts/types";

export type SuggestionCategory = {
  id: string;
  name: string;
};

export type GiftCreationOutcome = "created" | "duplicate";

export type EnrichableGift = {
  id: string;
  name: string;
};

export interface SuggestionGiftGateway {
  listGiftNames(): Promise<string[]>;
  listEnrichableGifts(): Promise<EnrichableGift[]>;
  enrichGift(actor: SessionUser, giftId: string, input: GiftInput): Promise<void>;
  listCategories(): Promise<SuggestionCategory[]>;
  createCategory(name: string): Promise<SuggestionCategory>;
  createGift(actor: SessionUser, input: GiftInput): Promise<GiftCreationOutcome>;
}
