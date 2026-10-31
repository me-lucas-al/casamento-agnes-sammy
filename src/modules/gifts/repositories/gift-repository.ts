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

export type GiftDeletionOutcome =
  | { status: "deleted"; gift: Gift }
  | { status: "not_found" }
  | { status: "has_confirmed" }
  | { status: "has_active_reservations" };

export type GiftUpdateOutcome =
  | { status: "updated"; gift: Gift }
  | { status: "not_found" }
  | { status: "pricing_locked" };

export interface GiftRepository {
  existsWithImagePublicId(publicId: string, excludedGiftId?: string): Promise<boolean>;
  findById(giftId: string): Promise<Gift | null>;
  create(draft: GiftDraft): Promise<Gift>;
  updateUnlessPricingLocked(giftId: string, draft: GiftDraft, now: Date): Promise<GiftUpdateOutcome>;
  deleteUnlessCommitted(giftId: string, now: Date): Promise<GiftDeletionOutcome>;
  listPage(query: GiftListQuery): Promise<GiftListPage>;
  hasConfirmedContribution(giftId: string): Promise<boolean>;
  sumActiveContributions(giftIds: string[], now: Date): Promise<Map<string, ContributionTotals>>;
}
