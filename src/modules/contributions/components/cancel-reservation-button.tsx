"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { cancelOwnReservationAction } from "../controllers/reserve-gift.actions";

type CancelReservationButtonProps = {
  contributionId: string;
};

export function CancelReservationButton({ contributionId }: CancelReservationButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function cancelReservation() {
    startTransition(async () => {
      const result = await cancelOwnReservationAction({ contributionId });
      if (!result.ok) return setErrorMessage(result.error);
      router.replace(pathname);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="outline" disabled={isPending} onClick={cancelReservation}>
        Cancelar reserva
      </Button>
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
    </div>
  );
}
