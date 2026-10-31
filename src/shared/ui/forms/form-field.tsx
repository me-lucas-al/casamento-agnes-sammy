import type { ReactNode } from "react";

type FormFieldProps = { label: string; htmlFor: string; hint?: string; children: ReactNode };

export function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-base font-semibold">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export const textInputClassName =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-rose/50";
