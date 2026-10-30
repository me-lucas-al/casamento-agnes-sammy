import { formatCentsAsBrl } from "@/shared/lib/money";

const inputClassName = "w-full rounded-lg border bg-white px-3 py-2 text-base";

type QuotaFieldProps = {
  quotas: number;
  maximumQuotas: number;
  quotaPriceCents: number;
  onChange: (quotas: number) => void;
};

export function QuotaField({ quotas, maximumQuotas, quotaPriceCents, onChange }: QuotaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
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
    <label className="flex flex-col gap-1 text-sm">
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
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 accent-rose"
      />
      <span>
        Contribuir de forma anônima
        <span className="block text-xs">Seu nome não aparece no mural de recados.</span>
      </span>
    </label>
  );
}
