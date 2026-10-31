"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { parseBrlToCents } from "@/shared/lib/money";
import { Button } from "@/shared/ui/button";
import {
  reserveGiftAction,
  updateReservationAction,
} from "../controllers/actions/reserve-gift.actions";
import type { ReservableGift } from "../types";
import { AmountField, AnonymousField, QuotaField } from "./reserve-form-fields";

type ReserveGiftFormProps = {
  gift: ReservableGift;
  remainingQuotas: number;
  remainingAmountCents: number;
  contributionId?: string;
  initialAnonymous?: boolean;
};

export function ReserveGiftForm({
  gift,
  remainingQuotas,
  remainingAmountCents,
  contributionId,
  initialAnonymous = false,
}: ReserveGiftFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quotas, setQuotas] = useState(1);
  const [amountText, setAmountText] = useState("");
  const [anonymous, setAnonymous] = useState(initialAnonymous);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const minimumCents = Math.min(gift.minAmountCents ?? 1, remainingAmountCents);
  const quotaPriceCents = Math.round(gift.priceCents / (gift.totalQuotas || 1));

  function submit() {
    setErrorMessage(null);
    const amountCents = parseBrlToCents(amountText) ?? undefined;
    const amountRequest =
      gift.mode === "fixed_quotas" ? { quotas } : gift.mode === "free_amount" ? { amountCents } : {};
    const request = { ...amountRequest, anonymous };
    startTransition(async () => {
      const result = contributionId
        ? await updateReservationAction({ contributionId, ...request })
        : await reserveGiftAction({ giftId: gift.id, ...request });
      if (!result.ok) return setErrorMessage(result.error);
      router.push(`/presentes/${gift.id}?reserva=${result.data.contributionId}`);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex flex-col gap-4"
    >
      {gift.mode === "fixed_quotas" ? (
        <QuotaField
          quotas={quotas}
          maximumQuotas={remainingQuotas}
          quotaPriceCents={quotaPriceCents}
          onChange={setQuotas}
        />
      ) : null}
      {gift.mode === "free_amount" ? (
        <AmountField
          amountText={amountText}
          minimumCents={minimumCents}
          maximumCents={remainingAmountCents}
          onChange={setAmountText}
        />
      ) : null}
      <AnonymousField checked={anonymous} onChange={setAnonymous} />
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
      <Button type="submit" size="lg" disabled={isPending} className="bg-rose text-white">
        {contributionId ? "Atualizar reserva" : "Reservar e pagar com Pix"}
      </Button>
    </form>
  );
}
