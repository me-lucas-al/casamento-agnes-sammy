"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { setUserActiveAction } from "../controllers/set-user-active.actions";

type ToggleUserActiveButtonProps = {
  userId: string;
  isActive: boolean;
};

export function ToggleUserActiveButton({ userId, isActive }: ToggleUserActiveButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await setUserActiveAction({ userId, isActive: !isActive });
      setErrorMessage(result.ok ? "" : result.error);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button size="sm" variant={isActive ? "destructive" : "outline"} disabled={isPending} onClick={toggle}>
        {isActive ? "Desativar" : "Reativar"}
      </Button>
      {errorMessage ? <p role="alert" className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
