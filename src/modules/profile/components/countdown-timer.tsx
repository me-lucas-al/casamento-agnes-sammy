"use client";

import { useSyncExternalStore } from "react";
import { computeCountdown } from "../lib/countdown";

type CountdownTimerProps = { targetIso: string };

const ONE_SECOND = 1000;

function subscribeToClock(onTick: () => void) {
  const intervalId = setInterval(onTick, ONE_SECOND);
  return () => clearInterval(intervalId);
}

function readClockSecond(): number {
  return Math.floor(Date.now() / ONE_SECOND);
}

function readServerClock(): null {
  return null;
}

type UnitProps = { value: number | null; label: string };

function CountdownUnit({ value, label }: UnitProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-paper px-2 py-3">
      <span className="font-display text-3xl tabular-nums text-crimson md:text-4xl">
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function CountdownTimer({ targetIso }: CountdownTimerProps) {
  const clockSecond = useSyncExternalStore(subscribeToClock, readClockSecond, readServerClock);
  const countdown = clockSecond === null ? null : computeCountdown(new Date(targetIso), new Date(clockSecond * ONE_SECOND));
  if (countdown?.isOver) return <p className="text-center text-xl">Chegou o grande dia!</p>;
  return (
    <div role="timer" aria-label="Contagem regressiva para o casamento" className="grid grid-cols-4 gap-2 text-center">
      <CountdownUnit value={countdown?.days ?? null} label="dias" />
      <CountdownUnit value={countdown?.hours ?? null} label="horas" />
      <CountdownUnit value={countdown?.minutes ?? null} label="min" />
      <CountdownUnit value={countdown?.seconds ?? null} label="seg" />
    </div>
  );
}
