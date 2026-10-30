"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { deleteGiftAction } from "../controllers/gift.actions";

export function DeleteGiftButton({ giftId }: { giftId: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Excluir este presente?")) return;
    setIsDeleting(true);
    const result = await deleteGiftAction(giftId);
    setIsDeleting(false);
    if (!result.ok) return setErrorMessage(result.error);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="destructive" size="sm" disabled={isDeleting} onClick={handleDelete}>
        Excluir
      </Button>
      {errorMessage ? <p role="alert" className="text-xs text-crimson">{errorMessage}</p> : null}
    </div>
  );
}
