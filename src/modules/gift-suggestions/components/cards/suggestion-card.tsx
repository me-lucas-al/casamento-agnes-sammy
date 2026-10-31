import { Check, Plus } from "lucide-react";
import { StoreLink } from "@/modules/gifts/components/cards/store-link";
import { formatPriceCheckedDate } from "@/modules/gifts/lib/product/product-link-rules";
import { ProductImage } from "@/shared/ui/media/product-image";
import { GiftPriceLabel } from "@/modules/gifts/components/cards/gift-price-label";
import { cn } from "@/shared/lib/styling/utils";
import { PRODUCT_TYPE_LABELS } from "@/modules/gift-suggestions/data/product-types";
import { priceBandLabel } from "@/modules/gift-suggestions/lib/catalog/suggestion-labels";
import type { SuggestionWithStatus } from "@/modules/gift-suggestions/types";
import { ModeBadge, StoreBadge } from "./suggestion-badges";

type SuggestionCardProps = {
  suggestion: SuggestionWithStatus;
  isInList: boolean;
  isSelected: boolean;
  isBusy: boolean;
  onToggle: (suggestionId: string) => void;
  onAdd: (suggestionId: string) => void;
};

const IMAGE_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";

const actionClassName =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine";

export function SuggestionCard({ suggestion, isInList, isSelected, isBusy, onToggle, onAdd }: SuggestionCardProps) {
  const { id, name, description, store, storeName, productUrl, imageUrl, storeSearchUrl, mode, type, priceBand } = suggestion;
  const checkedDate = formatPriceCheckedDate(suggestion.priceCheckedAt);
  return (
    <li
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-colors",
        isSelected ? "border-rose ring-2 ring-rose/30" : "border-gold/40",
        isInList && "bg-paper",
      )}
    >
      {imageUrl ? (
        <ProductImage src={imageUrl} alt={name} sizes={IMAGE_SIZES} className="-mx-4 -mt-4 w-[calc(100%+2rem)]" />
      ) : null}
      <div className="flex min-h-9 items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <StoreBadge store={store} storeName={storeName} />
          <ModeBadge mode={mode} />
        </div>
        {isInList ? null : (
          <label className="-mr-2 -mt-2 flex size-11 shrink-0 cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(id)}
              className="size-5 accent-rose"
              aria-label={`Selecionar ${name}`}
            />
          </label>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-wine/70">
          {PRODUCT_TYPE_LABELS[type]} · {priceBandLabel(priceBand)}
        </p>
        <h3 className="break-words font-heading text-xl italic leading-snug text-wine">{name}</h3>
        <p className="text-base leading-snug text-foreground/80">{description}</p>
      </div>
      <GiftPriceLabel gift={{ mode, priceCents: suggestion.priceCents, totalQuotas: suggestion.totalQuotas ?? null, minAmountCents: suggestion.minAmountCents ?? null }} />
      {checkedDate ? <p className="-mt-2 text-xs text-wine/70">preço conferido em {checkedDate}</p> : null}
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {isInList ? (
          <span className={cn(actionClassName, "bg-wine text-paper")}>
            <Check aria-hidden className="size-4" />
            Já na lista
          </span>
        ) : (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onAdd(id)}
            className={cn(actionClassName, "bg-crimson text-paper hover:bg-wine disabled:opacity-60")}
          >
            <Plus aria-hidden className="size-4" />
            Adicionar à lista
          </button>
        )}
        <StoreLink productUrl={productUrl ?? storeSearchUrl} />
      </div>
    </li>
  );
}
