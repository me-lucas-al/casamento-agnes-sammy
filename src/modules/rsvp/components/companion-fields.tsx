"use client";

import type { Companion } from "../types";

type CompanionFieldsProps = {
  companions: Companion[];
  maxCompanions: number;
  onChange: (companions: Companion[]) => void;
};

const inputClassName = "w-full rounded-lg border border-wine/30 bg-paper px-3 py-2 text-sm";

export function CompanionFields({ companions, maxCompanions, onChange }: CompanionFieldsProps) {
  const updateCompanion = (index: number, changes: Partial<Companion>) =>
    onChange(companions.map((companion, position) => (position === index ? { ...companion, ...changes } : companion)));
  const removeCompanion = (index: number) => onChange(companions.filter((_, position) => position !== index));
  const addCompanion = () => onChange([...companions, { name: "", dietaryNote: null }]);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium text-wine">
        Acompanhantes ({companions.length} de {maxCompanions})
      </legend>
      {companions.map((companion, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg bg-blush/60 p-3">
          <input
            aria-label={`Nome do acompanhante ${index + 1}`}
            className={inputClassName}
            placeholder="Nome"
            value={companion.name}
            maxLength={120}
            onChange={(event) => updateCompanion(index, { name: event.target.value })}
          />
          <input
            aria-label={`Restrição alimentar do acompanhante ${index + 1}`}
            className={inputClassName}
            placeholder="Restrição alimentar (opcional)"
            value={companion.dietaryNote ?? ""}
            maxLength={200}
            onChange={(event) => updateCompanion(index, { dietaryNote: event.target.value })}
          />
          <button type="button" className="self-end text-xs text-crimson" onClick={() => removeCompanion(index)}>
            Remover
          </button>
        </div>
      ))}
      {companions.length < maxCompanions ? (
        <button type="button" className="self-start text-sm text-rose underline" onClick={addCompanion}>
          Adicionar acompanhante
        </button>
      ) : null}
    </fieldset>
  );
}
