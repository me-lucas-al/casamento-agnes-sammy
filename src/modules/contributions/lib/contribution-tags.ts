import { contributionsTag, giftsTag, giftTag, pendingPaymentsTag } from "@/shared/lib/cache/cache-tags";
import type { Contribution } from "../types";

export function tagsForContribution({ giftId, guestId }: Pick<Contribution, "giftId" | "guestId">) {
  return [giftsTag(), giftTag(giftId), contributionsTag(guestId), pendingPaymentsTag()];
}
