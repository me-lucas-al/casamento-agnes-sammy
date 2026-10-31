import type { SessionUser } from "@/modules/auth/types";
import type { GiftInput } from "@/modules/gifts/types";

export type SuggestionCategory = {
  id: string;
  name: string;
};

export type GiftCreationOutcome = "created" | "duplicate";

export interface SuggestionGiftGateway {
  listGiftNames(): Promise<string[]>;
  listCategories(): Promise<SuggestionCategory[]>;
  createCategory(name: string): Promise<SuggestionCategory>;
  createGift(actor: SessionUser, input: GiftInput): Promise<GiftCreationOutcome>;
}
