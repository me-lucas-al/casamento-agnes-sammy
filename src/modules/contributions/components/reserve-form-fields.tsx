import { formatCentsAsBrl } from "@/shared/lib/money/money";

const inputClassName = "w-full rounded-lg border bg-card px-3 py-2 text-base";

type QuotaFieldProps = {
  quotas: number;
  maximumQuotas: number;
  quotaPriceCents: number;
  onChange: (quotas: number) => void;
};

export function QuotaField({ quotas, maximumQuotas, quotaPriceCents, onChange }: QuotaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-base">
      Quantidade de cotas ({formatCentsAsBrl(quotaPriceCents)} cada)
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={maximumQuotas}
        value={quotas}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputClassName}
      />
    </label>
  );
}

type AmountFieldProps = {
  amountText: string;
  minimumCents: number;
  maximumCents: number;
  onChange: (amountText: string) => void;
};

export function AmountField({ amountText, minimumCents, maximumCents, onChange }: AmountFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-base">
      Valor (de {formatCentsAsBrl(minimumCents)} a {formatCentsAsBrl(maximumCents)})
      <input
        type="text"
        inputMode="decimal"
        placeholder="R$ 0,00"
        value={amountText}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
}

type AnonymousFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function AnonymousField({ checked, onChange }: AnonymousFieldProps) {
  return (
    <label className="flex min-h-11 items-start gap-3 py-1 text-base">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-5 shrink-0 accent-rose"
      />
      <span>
        Contribuir de forma anônima
        <span className="block text-sm">Seu nome não aparece no mural de recados.</span>
      </span>
    </label>
  );
}
