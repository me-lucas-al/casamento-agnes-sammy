import type { ContributionTotals } from "../lib/gift-availability";
import type { GiftSortOption } from "../lib/gift-sort";
import type { PriceBand } from "../lib/price-band";
import type { Gift, GiftDraft, GiftWithCategory } from "../types";

export type GiftListQuery = {
  limit: number;
  offset: number;
  search: string;
  categoryId?: string;
  sort: GiftSortOption;
  band?: PriceBand;
  onlyVisible: boolean;
};

export type GiftListPage = {
  items: GiftWithCategory[];
  total: number;
};

export interface GiftRepository {
  findById(giftId: string): Promise<Gift | null>;
  create(draft: GiftDraft): Promise<Gift>;
  update(giftId: string, draft: GiftDraft): Promise<Gift>;
  delete(giftId: string): Promise<void>;
  listPage(query: GiftListQuery): Promise<GiftListPage>;
  hasConfirmedContribution(giftId: string): Promise<boolean>;
  sumActiveContributions(giftIds: string[], now: Date): Promise<Map<string, ContributionTotals>>;
}
