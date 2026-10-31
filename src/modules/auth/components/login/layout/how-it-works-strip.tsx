import { CalendarCheck, Gift, QrCode, type LucideIcon } from "lucide-react";

const STEPS: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: "Escolher presente", Icon: Gift },
  { label: "Pagar via Pix", Icon: QrCode },
  { label: "Confirmar presença", Icon: CalendarCheck },
];

export function HowItWorksStrip() {
  return (
    <ul
      aria-label="Como funciona"
      className="hidden grid-cols-3 gap-2 border-t border-gold/40 pt-3 [@media(min-height:760px)]:grid"
    >
      {STEPS.map(({ label, Icon }) => (
        <li key={label} className="flex flex-col items-center gap-1 text-center text-base leading-tight text-wine">
          <Icon aria-hidden className="size-5 text-rose" />
          {label}
        </li>
      ))}
    </ul>
  );
}
