import Link from "next/link";
import type { PublicGiftListItem } from "@/modules/gifts/use-cases/catalog/list-visible-gifts-page";
import { ProductImage } from "@/shared/ui/media/product-image";
import { GiftPriceLabel } from "./gift-price-label";
import { GiftStatusBadge } from "./gift-status-badge";
import { StoreBadge } from "./store-badge";
import { StoreLink } from "./store-link";

const IMAGE_SIZES = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function GiftCard({ gift }: { gift: PublicGiftListItem }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-gold/40 bg-white shadow-sm">
      <Link href={`/presentes/${gift.id}`} className="flex flex-1 flex-col">
        <ProductImage src={gift.imageUrl} alt="" sizes={IMAGE_SIZES} />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="break-words text-lg font-semibold text-wine">{gift.name}</h2>
          <GiftPriceLabel gift={gift} />
          <div className="mt-auto pt-2">
            <GiftStatusBadge availability={gift.availability} />
          </div>
        </div>
      </Link>
      {gift.productUrl ? (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-4">
          <StoreBadge storeName={gift.storeName} />
          <StoreLink productUrl={gift.productUrl} />
        </div>
      ) : null}
    </li>
  );
}
