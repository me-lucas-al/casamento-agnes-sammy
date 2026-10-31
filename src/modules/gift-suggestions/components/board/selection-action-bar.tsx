type SelectionActionBarProps = {
  selectedCount: number;
  isBusy: boolean;
  onAdd: () => void;
  onClear: () => void;
};

export function SelectionActionBar({ selectedCount, isBusy, onAdd, onClear }: SelectionActionBarProps) {
  if (selectedCount === 0) return null;
  const label = selectedCount === 1 ? "Adicionar 1 presente à lista" : `Adicionar ${selectedCount} presentes à lista`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold bg-paper-dark/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(91,26,46,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-base font-semibold text-wine">
          {selectedCount === 1 ? "1 selecionado" : `${selectedCount} selecionados`}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClear}
            className="min-h-11 rounded-full border border-gold bg-card px-5 text-base text-wine hover:bg-blush"
          >
            Limpar seleção
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={onAdd}
            className="min-h-11 flex-1 rounded-full bg-crimson px-6 text-base font-semibold text-paper hover:bg-wine disabled:opacity-60 sm:flex-none"
          >
            {isBusy ? "Adicionando..." : label}
          </button>
        </div>
      </div>
    </div>
  );
}
