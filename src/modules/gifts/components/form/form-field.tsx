import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export const fieldControlClassName =
  "w-full rounded-lg border border-gold/50 bg-white px-3 py-2 text-base text-wine outline-none focus:border-rose";

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-wine">
      {label}
      {children}
      {hint ? <span className="text-sm font-normal text-wine/80">{hint}</span> : null}
    </label>
  );
}
