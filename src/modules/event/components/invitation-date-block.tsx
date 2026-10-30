import Image from "next/image";
import type { EventDateParts } from "../lib/event-date-parts";

type InvitationDateBlockProps = { dateParts: EventDateParts };

function HeartDivider() {
  return (
    <div aria-hidden className="flex items-center gap-1 text-wine">
      <span className="h-px flex-1 bg-wine/70" />
      <span className="text-[10px] text-rose-soft">&#9829;</span>
      <span className="h-px flex-1 bg-wine/70" />
    </div>
  );
}

export function InvitationDateBlock({ dateParts }: InvitationDateBlockProps) {
  const { day, month, shortYear, weekday, time } = dateParts;
  return (
    <div className="flex items-center justify-center gap-4 px-4">
      <Image
        src="/brand/save-the-date.png"
        alt="Save the Date"
        width={290}
        height={350}
        className="w-[34%] max-w-[150px]"
      />
      <div className="flex w-[52%] max-w-[240px] flex-col gap-1 text-center text-rose-soft">
        <p className="font-display text-3xl leading-none">
          {day}
          <span className="px-1 text-base text-fuchsia">&#9829;</span>
          {month}
          <span className="px-1 text-base text-fuchsia">&#9829;</span>
          {shortYear}
        </p>
        <HeartDivider />
        <p className="font-display text-4xl leading-tight">{weekday}</p>
        <HeartDivider />
        <p className="font-display text-4xl leading-tight">{time}</p>
      </div>
    </div>
  );
}
