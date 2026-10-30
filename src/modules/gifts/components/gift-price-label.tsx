import { formatCentsAsBrl } from "@/shared/lib/money";
import { quotaPriceRange } from "../lib/quota-pricing";
import type { PublicGift } from "../types";

type GiftPriceLabelProps = {
  gift: Pick<PublicGift, "mode" | "priceCents" | "totalQuotas" | "minAmountCents">;
};

function describeQuotaPrice(priceCents: number, totalQuotas: number): string {
  const range = quotaPriceRange(priceCents, totalQuotas);
  if (!range) return "";
  const perQuota =
    range.minCents === range.maxCents
      ? formatCentsAsBrl(range.minCents)
      : `${formatCentsAsBrl(range.minCents)} a ${formatCentsAsBrl(range.maxCents)}`;
  return `${totalQuotas} cotas de ${perQuota}`;
}

export function GiftPriceLabel({ gift }: GiftPriceLabelProps) {
  const total = formatCentsAsBrl(gift.priceCents);
  const detail = describeDetail(gift);
  return (
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-wine">{total}</span>
      {detail ? <span className="text-xs text-wine/70">{detail}</span> : null}
    </div>
  );
}

function describeDetail(gift: GiftPriceLabelProps["gift"]): string {
  if (gift.mode === "fixed_quotas" && gift.totalQuotas) {
    return describeQuotaPrice(gift.priceCents, gift.totalQuotas);
  }
  if (gift.mode === "free_amount" && gift.minAmountCents) {
    return `Contribua a partir de ${formatCentsAsBrl(gift.minAmountCents)}`;
  }
  return "";
}
