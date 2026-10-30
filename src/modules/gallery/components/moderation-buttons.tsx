"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/shared/lib/result";
import {
  approvePhotoAction,
  deletePhotoAction,
  rejectPhotoAction,
} from "../controllers/moderate-photo.actions";
import type { PhotoStatus } from "../types";

type ModerationButtonsProps = { photoId: string; status: PhotoStatus };

const buttonClassName = "rounded-full border px-3 py-1 text-sm disabled:opacity-50";

export function ModerationButtons({ photoId, status }: ModerationButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: (photoId: string) => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action(photoId);
      setError(result.ok ? null : result.error);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "approved" ? (
        <button type="button" disabled={isPending} className={buttonClassName} onClick={() => run(approvePhotoAction)}>
          Aprovar
        </button>
      ) : null}
      {status !== "rejected" ? (
        <button type="button" disabled={isPending} className={buttonClassName} onClick={() => run(rejectPhotoAction)}>
          Rejeitar
        </button>
      ) : null}
      <button type="button" disabled={isPending} className={buttonClassName} onClick={() => run(deletePhotoAction)}>
        Excluir
      </button>
      {error ? <p role="alert" className="w-full text-sm text-crimson">{error}</p> : null}
    </div>
  );
}
