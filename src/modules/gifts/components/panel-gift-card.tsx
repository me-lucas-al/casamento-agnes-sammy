import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";
import type { PanelGiftListItem } from "../use-cases/list-panel-gifts-page";
import { DeleteGiftButton } from "./delete-gift-button";
import { GiftPriceLabel } from "./gift-price-label";
import { GiftStatusBadge } from "./gift-status-badge";
import { GiftThumbnail } from "./gift-thumbnail";

export function PanelGiftCard({ gift }: { gift: PanelGiftListItem }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-gold/40 bg-white shadow-sm">
      <GiftThumbnail imageUrl={gift.imageUrl} name={gift.name} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{gift.categoryName}</span>
        <h2 className="break-words text-lg font-semibold text-wine">{gift.name}</h2>
        <GiftPriceLabel gift={gift} />
        <div className="flex flex-wrap items-center gap-2">
          <GiftStatusBadge availability={gift.availability} />
          {gift.isVisible ? null : (
            <span className="rounded-full bg-paper-dark px-3 py-1 text-xs text-wine">Oculto</span>
          )}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link href={`/painel/presentes/${gift.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Editar
          </Link>
          <DeleteGiftButton giftId={gift.id} />
        </div>
      </div>
    </li>
  );
}
