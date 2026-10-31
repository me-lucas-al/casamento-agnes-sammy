import { Store } from "lucide-react";
import type { GiftMode } from "@/modules/gifts/types";
import { cn } from "@/shared/lib/utils";
import { STORE_LABELS, type StoreId } from "@/modules/gift-suggestions/data/stores";
import { MODE_BADGE_LABELS } from "@/modules/gift-suggestions/lib/catalog/suggestion-labels";

export function StoreBadge({ store }: { store: StoreId | null }) {
  if (!store) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-blush px-3 py-1 text-xs font-semibold text-wine">
      <Store aria-hidden className="size-3.5" />
      {STORE_LABELS[store]}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: GiftMode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        mode === "single" ? "bg-paper-dark text-wine" : "bg-rose/15 text-crimson",
      )}
    >
      {MODE_BADGE_LABELS[mode]}
    </span>
  );
}
