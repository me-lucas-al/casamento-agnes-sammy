import Link from "next/link";
import { resolveGiftImageUrl } from "@/modules/gifts/lib/images/resolve-gift-image-url";
import { ProductImage } from "@/shared/ui/media/product-image";
import { buttonVariants } from "@/shared/ui/primitives/button";
import type { PanelGiftListItem } from "@/modules/gifts/use-cases/catalog/list-panel-gifts-page";
import { DeleteGiftButton } from "../management/delete-gift-button";
import { GiftPriceLabel } from "./gift-price-label";
import { GiftStatusBadge } from "./gift-status-badge";
import { StoreBadge } from "./store-badge";
import { StoreLink } from "./store-link";

const IMAGE_SIZES = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw";

export function PanelGiftCard({ gift }: { gift: PanelGiftListItem }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-gold/40 bg-white shadow-sm">
      <ProductImage src={resolveGiftImageUrl(gift)} alt={gift.name} sizes={IMAGE_SIZES} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-sm uppercase tracking-wide text-muted-foreground">{gift.categoryName}</span>
        <h2 className="break-words text-lg font-semibold text-wine">{gift.name}</h2>
        <GiftPriceLabel gift={gift} />
        <StoreBadge storeName={gift.storeName} priceCheckedAt={gift.priceCheckedAt} />
        <div className="flex flex-wrap items-center gap-2">
          <GiftStatusBadge availability={gift.availability} />
          {gift.isVisible ? null : (
            <span className="rounded-full bg-paper-dark px-3 py-1 text-sm text-wine">Oculto</span>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <StoreLink productUrl={gift.productUrl} />
          <Link href={`/painel/presentes/${gift.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Editar
          </Link>
          <DeleteGiftButton giftId={gift.id} giftName={gift.name} />
        </div>
      </div>
    </li>
  );
}
