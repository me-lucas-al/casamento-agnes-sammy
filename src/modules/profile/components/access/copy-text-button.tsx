"use client";

import { useState } from "react";

type CopyTextButtonProps = { text: string; label: string };

const FEEDBACK_MS = 2000;

export function CopyTextButton({ text, label }: CopyTextButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      aria-live="polite"
      className="rounded-full bg-rose px-4 py-2 text-base text-white transition-colors hover:bg-crimson"
    >
      {status === "copied" ? "Copiado!" : status === "failed" ? "Não foi possível copiar" : label}
    </button>
  );
}
