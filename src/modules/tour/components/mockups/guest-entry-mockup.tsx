"use client";

import Image from "next/image";
import { useState } from "react";
import { MockField } from "./mock-field";
import { PhoneFrame } from "./phone-frame";
import { SegmentedChoice } from "./segmented-choice";

type EntryPhase = "code" | "profile";

const PHASE_OPTIONS = [
  { value: "code", label: "1. Entrar com o código" },
  { value: "profile", label: "2. Primeiro acesso" },
] as const;

function CodeScreen() {
  return (
    <>
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-16 w-auto" />
        <p className="font-heading text-2xl italic">Entrar com o código</p>
        <p className="text-sm">Digite o código que você recebeu dos noivos.</p>
      </div>
      <MockField label="Código do convite" value="K7M2QX9P" isHighlighted />
      <span className="rounded-full bg-rose px-5 py-2 text-center text-base font-semibold text-white">Entrar</span>
      <p className="break-all rounded-lg bg-blush px-2 py-1.5 text-center text-sm">
        Pelo link do WhatsApp o código já vem preenchido: /entrar?codigo=K7M2QX9P
      </p>
    </>
  );
}

function ProfileScreen() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gold/60 bg-paper p-3 shadow-lg">
      <p className="font-heading text-xl italic leading-tight">Bem-vindo(a)! Conte um pouco sobre você</p>
      <MockField label="Nome" value="Tia Marta" />
      <MockField label="Telefone" value="(11) 99999-0000" />
      <MockField label="E-mail" value="marta@exemplo.com" />
      <MockField label="Familiar 1 (até 2)" value="Tio Paulo" />
      <MockField label="Familiar 2" value="Prima Ana" />
      <span className="rounded-full bg-rose px-5 py-2 text-center text-base font-semibold text-white">
        Salvar e entrar
      </span>
    </div>
  );
}

export function GuestEntryMockup() {
  const [phase, setPhase] = useState<EntryPhase>("code");
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SegmentedChoice ariaLabel="Etapa da entrada" options={PHASE_OPTIONS} value={phase} onChange={setPhase} />
      <PhoneFrame label="Exemplo da entrada do convidado no celular">
        {phase === "code" ? <CodeScreen /> : <ProfileScreen />}
      </PhoneFrame>
    </div>
  );
}
