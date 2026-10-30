import Image from "next/image";
import Link from "next/link";
import { getEventDateParts } from "../lib/event-date-parts";
import type { EventSettingsSnapshot } from "../types";
import { InvitationDateBlock } from "./invitation-date-block";
import { FloralCorners } from "@/shared/ui/components/floral-corners";

type EventInvitationProps = { settings: EventSettingsSnapshot };

function splitCoupleNames(coupleNames: string): [string, string] {
  const [first = coupleNames, second = ""] = coupleNames.split("&").map((name) => name.trim());
  return [first, second];
}

export function EventInvitation({ settings }: EventInvitationProps) {
  const dateParts = getEventDateParts(new Date(settings.eventAt));
  const [firstName, secondName] = splitCoupleNames(settings.coupleNames);
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-8 overflow-hidden bg-paper pt-24 text-center tracking-widest">
      <FloralCorners />
      <section className="relative flex flex-col items-center gap-4">
        <div aria-hidden className="absolute inset-x-6 -top-8 h-44">
          <Image src="/brand/paper-strip.png" alt="" fill sizes="448px" className="object-fill opacity-90" />
        </div>
        <h1 className="relative px-10 text-3xl leading-snug">Venha celebrar o nosso casamento!</h1>
        <div className="relative flex items-center justify-center gap-1">
          <span className="font-heading text-3xl italic">{firstName}</span>
          <Image src="/brand/monogram.png" alt="Monograma A e S" width={168} height={300} priority className="h-44 w-auto" />
          <span className="font-heading text-3xl italic">{secondName}</span>
        </div>
      </section>
      <p className="px-8 text-lg leading-relaxed">
        Após dizermos &ldquo;Simmmm&rdquo; no civil, queremos comemorar esse momento com você em um jantar especial!
      </p>
      <InvitationDateBlock dateParts={dateParts} />
      <section className="relative flex flex-col gap-1 px-6 text-lg">
        <h2 className="text-2xl font-semibold">{settings.venueName}</h2>
        <p>{settings.address}</p>
        <p className="text-rose-soft">(com espaço reservado)</p>
        {settings.mapUrl ? (
          <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="text-crimson underline underline-offset-4">
            Ver no mapa
          </a>
        ) : null}
      </section>
      {settings.story ? <p className="relative whitespace-pre-line px-8 text-lg">{settings.story}</p> : null}
      <Link
        href="/confirmar-presenca"
        className="relative mx-4 rounded-2xl bg-blush px-4 py-4 text-xl transition-colors hover:bg-rose hover:text-white"
      >
        Confirme sua presença
      </Link>
      <footer className="relative bg-crimson px-4 py-3 text-center text-base tracking-normal text-paper">
        com carinho, {firstName} e {secondName}
      </footer>
    </div>
  );
}
