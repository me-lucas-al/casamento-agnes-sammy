"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/use-confirm-dialog";
import {
  confirmPixPaymentAction,
  rejectOrCancelByCoupleAction,
  removeContributionAction,
} from "../controllers/payment-review.actions";
import type { ContributionStatus } from "../types";

type PaymentRowActionsProps = {
  contributionId: string;
  status: ContributionStatus;
  label: string;
};

export function PaymentRowActions({ contributionId, status, label }: PaymentRowActionsProps) {
  const { ask, dialogProps } = useConfirmDialog();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function run(execute: () => Promise<{ ok: boolean; error?: string }>) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await execute();
      if (!result.ok) return setErrorMessage(result.error ?? "Erro inesperado.");
      router.refresh();
    });
  }

  function confirmAction(
    execute: () => Promise<{ ok: boolean; error?: string }>,
    copy: { title: string; description: string; confirmLabel: string },
  ) {
    ask({
      ...copy,
      tone: "destructive",
      onConfirm: async () => {
        const result = await execute();
        if (result.ok) router.refresh();
        return result;
      },
    });
  }

  const canConfirm = status === "reserved";
  const canCancel = status === "reserved" || status === "confirmed";

  return (
    <div className="flex flex-col gap-2">
      {canConfirm ? (
        <input
          type="text"
          value={message}
          maxLength={500}
          placeholder="Recado do convidado (opcional)"
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        {canConfirm ? (
          <Button
            type="button"
            disabled={isPending}
            className="bg-rose text-white"
            onClick={() => run(() => confirmPixPaymentAction({ contributionId, message }))}
          >
            Confirmar pagamento
          </Button>
        ) : null}
        {canCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              confirmAction(() => rejectOrCancelByCoupleAction({ contributionId }), canConfirm
                ? {
                    title: `Rejeitar o pagamento de ${label}?`,
                    description: "A reserva será cancelada.",
                    confirmLabel: "Rejeitar pagamento",
                  }
                : {
                    title: `Cancelar o pagamento de ${label}?`,
                    description: "O pagamento confirmado será cancelado.",
                    confirmLabel: "Cancelar pagamento",
                  })
            }
          >
            {canConfirm ? "Rejeitar" : "Cancelar"}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            confirmAction(() => removeContributionAction({ contributionId }), {
              title: `Excluir o pagamento de ${label}?`,
              description: "O registro será removido do painel. Essa ação não pode ser desfeita.",
              confirmLabel: "Excluir pagamento",
            })
          }
        >
          Excluir
        </Button>
      </div>
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
