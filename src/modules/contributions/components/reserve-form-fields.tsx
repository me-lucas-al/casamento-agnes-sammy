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
