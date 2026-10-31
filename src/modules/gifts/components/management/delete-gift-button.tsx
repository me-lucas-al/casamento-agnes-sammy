"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/use-confirm-dialog";
import { deleteGiftAction } from "@/modules/gifts/controllers/actions/gift.actions";

type DeleteGiftButtonProps = { giftId: string; giftName: string };

export function DeleteGiftButton({ giftId, giftName }: DeleteGiftButtonProps) {
  const router = useRouter();
  const { ask, dialogProps } = useConfirmDialog();

  function requestDeletion() {
    ask({
      title: `Excluir ${giftName}?`,
      description: "O presente será removido da lista. Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir presente",
      tone: "destructive",
      onConfirm: async () => {
        const result = await deleteGiftAction(giftId);
        if (result.ok) router.refresh();
        return result;
      },
    });
  }

  return (
    <>
      <Button type="button" variant="destructive" size="sm" onClick={requestDeletion}>
        Excluir
      </Button>
      <ConfirmDialog {...dialogProps} />
    </>
  );
}
