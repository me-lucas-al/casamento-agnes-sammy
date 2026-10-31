import Link from "next/link";
import type { PublicGiftListItem } from "../use-cases/list-visible-gifts-page";
import { GiftPriceLabel } from "./gift-price-label";
import { GiftStatusBadge } from "./gift-status-badge";
import { GiftThumbnail } from "./gift-thumbnail";

export function GiftCard({ gift }: { gift: PublicGiftListItem }) {
  return (
    <li className="overflow-hidden rounded-xl border border-gold/40 bg-white shadow-sm">
      <Link href={`/presentes/${gift.id}`} className="flex h-full flex-col">
        <GiftThumbnail imageUrl={gift.imageUrl} name={gift.name} />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-sm uppercase tracking-wide text-muted-foreground">{gift.categoryName}</span>
          <h2 className="break-words text-lg font-semibold text-wine">{gift.name}</h2>
          <GiftPriceLabel gift={gift} />
          <div className="mt-auto pt-2">
            <GiftStatusBadge availability={gift.availability} />
          </div>
        </div>
      </Link>
    </li>
  );
}
