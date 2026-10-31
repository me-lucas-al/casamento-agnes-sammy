import { cn } from "@/shared/lib/utils";

type MockFieldProps = { label: string; value: string; isHighlighted?: boolean; className?: string };

export function MockField({ label, value, isHighlighted = false, className }: MockFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <span className="text-sm font-semibold">{label}</span>
      <span
        className={cn(
          "flex min-h-10 items-center truncate rounded-lg border bg-paper px-3 text-base",
          isHighlighted ? "border-rose ring-2 ring-rose/30" : "border-input/60",
        )}
      >
        {value}
      </span>
    </div>
  );
}
