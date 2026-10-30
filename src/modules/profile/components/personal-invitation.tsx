import Image from "next/image";
import Link from "next/link";
import { InvitationDateBlock } from "@/modules/event/components/invitation-date-block";
import { getEventDateParts } from "@/modules/event/lib/event-date-parts";
import type { EventSettingsSnapshot } from "@/modules/event/types";
import { splitCoupleNames } from "../lib/split-couple-names";
import type { GuestProfile } from "../types";

type PersonalInvitationProps = { settings: EventSettingsSnapshot; profile: GuestProfile };

export function PersonalInvitation({ settings, profile }: PersonalInvitationProps) {
  const dateParts = getEventDateParts(new Date(settings.eventAt));
  const [firstName, secondName] = splitCoupleNames(settings.coupleNames);
  return (
    <article className="relative mx-auto flex w-full max-w-md flex-col gap-6 overflow-hidden rounded-3xl border border-gold/40 bg-paper px-4 pb-8 pt-12 text-center tracking-widest">
      <div aria-hidden className="absolute inset-x-4 -top-6 h-40">
        <Image src="/brand/paper-strip.png" alt="" fill sizes="448px" className="object-fill opacity-90" />
      </div>
      <p className="relative text-lg">Convite especial para</p>
      <h1 className="relative font-heading text-3xl italic text-crimson">{profile.name}</h1>
      <div className="relative flex items-center justify-center gap-1">
        <span className="font-heading text-2xl italic">{firstName}</span>
        <Image src="/brand/monogram.png" alt="Monograma A e S" width={168} height={300} className="h-36 w-auto" />
        <span className="font-heading text-2xl italic">{secondName}</span>
      </div>
      <InvitationDateBlock dateParts={dateParts} />
      <p className="text-lg">
        {profile.seats} {profile.seats === 1 ? "lugar reservado" : "lugares reservados"}
      </p>
      <Link
        href="/confirmar-presenca"
        className="relative mx-2 rounded-2xl bg-blush px-4 py-4 text-xl transition-colors hover:bg-rose hover:text-white"
      >
        Confirme presença
      </Link>
    </article>
  );
}
