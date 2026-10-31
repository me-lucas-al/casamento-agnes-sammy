"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/primitives/button";
import { ConfirmDialog } from "@/shared/ui/dialogs/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/dialogs/use-confirm-dialog";
import { setUserActiveAction } from "../controllers/actions/set-user-active.actions";

type ToggleUserActiveButtonProps = {
  userId: string;
  userName: string;
  isActive: boolean;
};

export function ToggleUserActiveButton({ userId, userName, isActive }: ToggleUserActiveButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const { ask, dialogProps } = useConfirmDialog();

  function requestDeactivation() {
    ask({
      title: `Desativar ${userName}?`,
      description: "Essa pessoa não conseguirá mais entrar no painel até ser reativada.",
      confirmLabel: "Desativar usuário",
      tone: "destructive",
      onConfirm: async () => {
        const result = await setUserActiveAction({ userId, isActive: false });
        if (result.ok) router.refresh();
        return result;
      },
    });
  }

  function toggle() {
    if (isActive) return requestDeactivation();
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
      <ConfirmDialog {...dialogProps} />
      {errorMessage ? <p role="alert" className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
