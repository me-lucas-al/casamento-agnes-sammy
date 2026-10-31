import type { ReactNode } from "react";

type ProfileField = { label: string; value: ReactNode };

type ProfileFieldsProps = { fields: readonly ProfileField[] };

export function ProfileFields({ fields }: ProfileFieldsProps) {
  return (
    <dl className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="flex flex-col gap-1 rounded-2xl border border-gold/40 bg-paper px-4 py-3">
          <dt className="text-base text-rose">{field.label}</dt>
          <dd className="break-words text-xl">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
