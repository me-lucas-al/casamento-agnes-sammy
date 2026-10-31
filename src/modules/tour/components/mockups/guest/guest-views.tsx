import { Gift } from "lucide-react";
import type { ReactNode } from "react";
import { CountdownTimer } from "@/modules/profile/components/countdown-timer";
import { GiftStatusBadge } from "@/modules/gifts/components/gift-status-badge";
import { MockBadge } from "../parts/mock-badge";
import { buildAmountAvailability, buildQuotaAvailability } from "../parts/mock-availability";

const WEDDING_DATE_ISO = "2026-11-07T19:00:00-03:00";

export function GuestHomeView() {
  return (
    <>
      <p className="font-heading text-2xl italic leading-tight">Olá, Tia Marta!</p>
      <p className="text-base">Falta pouco para a nossa festa:</p>
      <CountdownTimer targetIso={WEDDING_DATE_ISO} />
      <p className="rounded-xl bg-blush px-3 py-2 text-base">Sábado, 07/11, às 19h. Restaurante Fazenda, Itatiba.</p>
    </>
  );
}

export function GuestInviteView() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-paper-dark px-3 py-5 text-center">
      <p className="font-heading text-xl italic">Venha celebrar o nosso casamento!</p>
      <p className="font-script text-3xl text-rose">Save the Date</p>
      <p className="font-display text-xl text-rose">07 &#9829; 11 &#9829; 26</p>
      <p className="text-base">Restaurante Fazenda, Itatiba/SP</p>
      <span className="rounded-full bg-blush px-4 py-1 text-base">Confirme sua presença</span>
    </div>
  );
}

function MockGiftRow({ name, children }: { name: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-gold/40 bg-white p-2">
      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blush text-rose">
        <Gift className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="truncate text-base font-semibold leading-tight">{name}</span>
        {children}
      </div>
    </li>
  );
}

export function GuestGiftsView() {
  return (
    <>
      <p className="font-heading text-2xl italic leading-tight">Lista de presentes</p>
      <ul className="flex flex-col gap-2">
        <MockGiftRow name="Jogo de panelas">
          <GiftStatusBadge availability={buildQuotaAvailability(6, 0)} />
        </MockGiftRow>
        <MockGiftRow name="Lua de mel">
          <GiftStatusBadge availability={buildQuotaAvailability(10, 4)} />
        </MockGiftRow>
        <MockGiftRow name="Cafeteira">
          <GiftStatusBadge availability={buildAmountAvailability(40000, 40000)} />
        </MockGiftRow>
      </ul>
      <p className="text-sm">Ninguém vê o nome de quem já presenteou.</p>
    </>
  );
}

export function GuestMyGiftsView() {
  return (
    <>
      <p className="font-heading text-2xl italic leading-tight">Meus presentes</p>
      <ul className="flex flex-col gap-2">
        <MockGiftRow name="Lua de mel, 1 cota">
          <MockBadge tone="warning">Aguardando Pix</MockBadge>
        </MockGiftRow>
        <MockGiftRow name="Jogo de panelas">
          <MockBadge tone="success">Confirmado</MockBadge>
        </MockGiftRow>
      </ul>
      <p className="text-sm">A reserva vale por 48 horas. Depois, a cota volta para a lista.</p>
    </>
  );
}
