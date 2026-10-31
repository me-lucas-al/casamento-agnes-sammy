import Link from "next/link";
import { formatDateTimeInSaoPaulo, isExpired } from "@/shared/lib/dates";
import { formatCentsAsBrl } from "@/shared/lib/money";
import { CONTRIBUTION_STATUS_LABELS } from "../lib/describe-availability";
import type { ContributionWithGift } from "../types";
import { CancelReservationButton } from "./cancel-reservation-button";

type MyContributionCardProps = {
  contribution: ContributionWithGift;
  now: Date;
};

export function MyContributionCard({ contribution, now }: MyContributionCardProps) {
  const lapsed = contribution.status === "reserved" && isExpired(contribution.expiresAt, now);
  const status = lapsed ? "expired" : contribution.status;
  const isOpen = status === "reserved";
  return (
    <li className="flex flex-col gap-2 rounded-2xl border bg-paper p-4 text-wine">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-heading text-lg">{contribution.giftName}</h2>
        <span className="rounded-full bg-blush px-3 py-1 text-sm">
          {CONTRIBUTION_STATUS_LABELS[status]}
        </span>
      </div>
      <p className="text-sm">
        {formatCentsAsBrl(contribution.amountCents)}
        {contribution.quotas ? ` · ${contribution.quotas} cota(s)` : ""}
        {contribution.anonymous ? " · anônimo" : ""}
      </p>
      {isOpen ? (
        <p className="text-sm">Reserva válida até {formatDateTimeInSaoPaulo(contribution.expiresAt)}</p>
      ) : null}
      {isOpen ? (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/presentes/${contribution.giftId}?reserva=${contribution.id}`}
            className="rounded-lg bg-rose px-3 py-1.5 text-sm text-white"
          >
            Ver Pix / alterar
          </Link>
          <CancelReservationButton contributionId={contribution.id} />
        </div>
      ) : null}
    </li>
  );
}
