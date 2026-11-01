"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addSuggestedGiftsAction } from "../controllers/actions/suggestions.actions";

export type AddFeedback =
  | { kind: "success"; createdCount: number; enrichedCount: number; skippedCount: number; failedCount: number }
  | { kind: "error"; message: string };

export function useSuggestionAdding() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [addedIds, setAddedIds] = useState<ReadonlySet<string>>(new Set());
  const [feedback, setFeedback] = useState<AddFeedback | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle(suggestionId: string) {
    const next = new Set(selectedIds);
    if (next.has(suggestionId)) next.delete(suggestionId);
    else next.add(suggestionId);
    setSelectedIds(next);
  }

  function toggleAll(suggestionIds: readonly string[]) {
    const allSelected = suggestionIds.every((suggestionId) => selectedIds.has(suggestionId));
    setSelectedIds(allSelected ? new Set() : new Set(suggestionIds));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function add(suggestionIds: readonly string[]) {
    if (suggestionIds.length === 0 || isPending) return;
    startTransition(async () => {
      const result = await addSuggestedGiftsAction({ suggestionIds });
      if (!result.ok) return setFeedback({ kind: "error", message: result.error });
      setAddedIds((current) => new Set([...current, ...suggestionIds]));
      setSelectedIds(new Set());
      setFeedback({ kind: "success", createdCount: result.data.createdCount, enrichedCount: result.data.enrichedCount, skippedCount: result.data.skippedIds.length, failedCount: result.data.failedIds.length });
      router.refresh();
    });
  }

  return { selectedIds, addedIds, feedback, isPending, toggle, toggleAll, clearSelection, add };
}
