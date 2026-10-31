"use client";

import { useSuggestionAdding } from "../hooks/use-suggestion-adding";
import type { SuggestionWithStatus } from "../types";
import { AddFeedbackMessage } from "./add-feedback-message";
import { SelectionActionBar } from "./selection-action-bar";
import { SuggestionCard } from "./suggestion-card";

export function SuggestionsBoard({ suggestions }: { suggestions: SuggestionWithStatus[] }) {
  const adding = useSuggestionAdding();
  const isInList = (suggestion: SuggestionWithStatus) => suggestion.alreadyInList || adding.addedIds.has(suggestion.id);
  const pageSelectableIds = suggestions.filter((suggestion) => !isInList(suggestion)).map((suggestion) => suggestion.id);
  const allOnPageSelected = pageSelectableIds.length > 0 && pageSelectableIds.every((id) => adding.selectedIds.has(id));

  return (
    <div className="flex flex-col gap-4 pb-24">
      <AddFeedbackMessage feedback={adding.feedback} />
      {pageSelectableIds.length > 0 ? (
        <button
          type="button"
          onClick={() => adding.toggleAll(pageSelectableIds)}
          className="min-h-11 w-fit rounded-full border border-gold bg-card px-5 text-base text-wine hover:bg-blush"
        >
          {allOnPageSelected ? "Desmarcar todos da página" : "Selecionar todos da página"}
        </button>
      ) : null}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            isInList={isInList(suggestion)}
            isSelected={adding.selectedIds.has(suggestion.id)}
            isBusy={adding.isPending}
            onToggle={adding.toggle}
            onAdd={(suggestionId) => adding.add([suggestionId])}
          />
        ))}
      </ul>
      <SelectionActionBar
        selectedCount={adding.selectedIds.size}
        isBusy={adding.isPending}
        onAdd={() => adding.add([...adding.selectedIds])}
        onClear={adding.clearSelection}
      />
    </div>
  );
}
