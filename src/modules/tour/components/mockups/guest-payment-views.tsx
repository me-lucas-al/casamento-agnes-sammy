"use client";

import { useState } from "react";
import { FakeQr } from "./fake-qr";

export function GuestReserveView() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  return (
    <>
      <p className="font-heading text-2xl italic leading-tight">Lua de mel</p>
      <p className="text-base">
        Você escolhe <strong>1 cota</strong> de R$ 100,00.
      </p>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-gold/60 bg-card px-3 text-base">
        <input type="checkbox" checked={isAnonymous} onChange={(event) => setIsAnonymous(event.target.checked)} />
        Presentear sem aparecer meu nome
      </label>
      <p aria-live="polite" className="text-sm">
        {isAnonymous ? "Só Agnes e Sammy saberão quem foi." : "Seu nome aparece para os noivos."}
      </p>
      <span className="rounded-full bg-rose px-5 py-2 text-center text-base font-semibold text-white">
        Reservar e pagar com Pix
      </span>
    </>
  );
}

export function GuestPixView() {
  return (
    <>
      <p className="font-heading text-2xl italic leading-tight">Pague com Pix</p>
      <p className="text-base">
        Valor: <strong>R$ 100,00</strong>
      </p>
      <div className="flex justify-center">
        <FakeQr />
      </div>
      <p className="break-all rounded-lg bg-paper-dark px-2 py-1.5 text-sm">00020126580014br.gov.bcb.pix0136...</p>
      <span className="rounded-full border border-wine/50 px-5 py-2 text-center text-base">Copiar código Pix</span>
      <p className="text-sm">Pague no app do seu banco. Os noivos confirmam o recebimento.</p>
    </>
  );
}
