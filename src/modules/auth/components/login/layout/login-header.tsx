import Image from "next/image";
import { getEventDateParts } from "@/modules/event/lib/event-date-parts";
import type { EventSettingsSnapshot } from "@/modules/event/types";

type LoginHeaderProps = { settings: EventSettingsSnapshot };

function splitCoupleNames(coupleNames: string): [string, string] {
  const [first = coupleNames, second = ""] = coupleNames.split("&").map((name) => name.trim());
  return [first, second];
}

function buildEventSubtitle(settings: EventSettingsSnapshot): string {
  const { weekday, day, month, shortYear, time } = getEventDateParts(new Date(settings.eventAt));
  const dateText = `${day}/${month}/${shortYear} · ${weekday} · ${time}`;
  return settings.venueName ? `${dateText} · ${settings.venueName}` : dateText;
}

export function LoginHeader({ settings }: LoginHeaderProps) {
  const [firstName, secondName] = splitCoupleNames(settings.coupleNames);
  return (
    <header className="flex flex-col items-center gap-1 text-center">
      <Image src="/brand/monogram.png" alt="" width={168} height={300} priority className="h-14 w-auto [@media(min-height:760px)]:h-24" />
      <h1 id="login-title" className="font-heading text-4xl font-semibold italic leading-tight text-wine">
        {firstName} &amp; {secondName}
      </h1>
      <p className="text-lg leading-snug text-wine">Que bom ter você aqui!</p>
      <p className="text-base tracking-wide text-rose">{buildEventSubtitle(settings)}</p>
    </header>
  );
}
