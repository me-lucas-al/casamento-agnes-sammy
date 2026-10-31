"use client";

import { cn } from "@/shared/lib/styling/utils";

type ChoiceOption<Value extends string> = { value: Value; label: string };

type SegmentedChoiceProps<Value extends string> = {
  ariaLabel: string;
  options: readonly ChoiceOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export function SegmentedChoice<Value extends string>({ ariaLabel, options, value, onChange }: SegmentedChoiceProps<Value>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap justify-center gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-4 text-base transition-colors",
            option.value === value ? "border-rose bg-rose text-white" : "border-gold/70 bg-card hover:bg-blush",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
