"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/primitives/button";
import { ConfirmDialog } from "@/shared/ui/dialogs/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/dialogs/use-confirm-dialog";
import { cancelOwnReservationAction } from "../controllers/actions/reserve-gift.actions";

type CancelReservationButtonProps = {
  contributionId: string;
};

export function CancelReservationButton({ contributionId }: CancelReservationButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { ask, dialogProps } = useConfirmDialog();

  function requestCancellation() {
    ask({
      title: "Cancelar sua reserva?",
      description: "O presente será liberado e você precisará reservar de novo se mudar de ideia.",
      confirmLabel: "Cancelar reserva",
      tone: "destructive",
      onConfirm: async () => {
        const result = await cancelOwnReservationAction({ contributionId });
        if (result.ok) router.replace(pathname);
        return result;
      },
    });
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={requestCancellation}>
        Cancelar reserva
      </Button>
      <ConfirmDialog {...dialogProps} />
    </>
  );
}
