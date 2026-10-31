"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/primitives/button";

type CopyButtonProps = {
  text: string;
  label: string;
};

const FEEDBACK_MILLISECONDS = 2000;

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), FEEDBACK_MILLISECONDS);
  }

  return (
    <Button type="button" variant="outline" onClick={copyText}>
      {copied ? "Copiado!" : label}
    </Button>
  );
}
