import { Store } from "lucide-react";
import { formatPriceCheckedDate } from "@/modules/gifts/lib/product/product-link-rules";

type StoreBadgeProps = {
  storeName: string | null;
  priceCheckedAt?: string | null;
};

export function StoreBadge({ storeName, priceCheckedAt }: StoreBadgeProps) {
  if (!storeName) return null;
  const checkedDate = formatPriceCheckedDate(priceCheckedAt);
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-blush px-3 py-1 text-xs font-semibold text-wine">
        <Store aria-hidden className="size-3.5" />
        {storeName}
      </span>
      {checkedDate ? <span className="text-xs text-wine/70">preço conferido em {checkedDate}</span> : null}
    </div>
  );
}
