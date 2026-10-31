"use client";

import { useState, type ReactNode } from "react";
import { PhoneFrame } from "./phone-frame";
import { GuestReserveView, GuestPixView } from "./guest-payment-views";
import { GuestGiftsView, GuestHomeView, GuestInviteView, GuestMyGiftsView } from "./guest-views";
import { SegmentedChoice } from "./segmented-choice";

type GuestScreen = "home" | "invite" | "gifts" | "reserve" | "pix" | "mine";

const SCREEN_OPTIONS = [
  { value: "home", label: "Início" },
  { value: "invite", label: "Convite" },
  { value: "gifts", label: "Presentes" },
  { value: "reserve", label: "Reserva" },
  { value: "pix", label: "Pix" },
  { value: "mine", label: "Meus presentes" },
] as const;

const SCREENS: Record<GuestScreen, ReactNode> = {
  home: <GuestHomeView />,
  invite: <GuestInviteView />,
  gifts: <GuestGiftsView />,
  reserve: <GuestReserveView />,
  pix: <GuestPixView />,
  mine: <GuestMyGiftsView />,
};

export function GuestViewsMockup() {
  const [screen, setScreen] = useState<GuestScreen>("home");
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SegmentedChoice ariaLabel="Tela do convidado" options={SCREEN_OPTIONS} value={screen} onChange={setScreen} />
      <PhoneFrame label="Exemplo das telas do convidado no celular">
        <div key={screen} className="flex flex-col gap-3 animate-in fade-in duration-300">
          {SCREENS[screen]}
        </div>
      </PhoneFrame>
    </div>
  );
}
