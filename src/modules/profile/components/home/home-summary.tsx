import Link from "next/link";
import { describeRsvpStatus } from "@/modules/profile/lib/rsvp-status-label";
import type { RsvpStatus } from "@/modules/profile/types";

type HomeSummaryProps = { rsvpStatus: RsvpStatus; contributionsCount: number };

export function HomeSummary({ rsvpStatus, contributionsCount }: HomeSummaryProps) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <Link href="/confirmar-presenca" className="rounded-2xl border border-gold/40 bg-paper px-4 py-3">
        <dt className="text-base text-rose">Sua presença</dt>
        <dd className="text-xl">{describeRsvpStatus(rsvpStatus)}</dd>
      </Link>
      <Link href="/meus-presentes" className="rounded-2xl border border-gold/40 bg-paper px-4 py-3">
        <dt className="text-base text-rose">Seus presentes</dt>
        <dd className="text-xl">
          {contributionsCount === 0
            ? "Nenhum presente ainda"
            : `${contributionsCount} ${contributionsCount === 1 ? "presente" : "presentes"}`}
        </dd>
      </Link>
    </dl>
  );
}
