import type { GiftFormValues } from "@/modules/gifts/lib/drafts/gift-form-values";
import { FormField, fieldControlClassName } from "./form-field";

type GiftModeFieldsProps = {
  values: GiftFormValues;
  onChange: (changes: Partial<GiftFormValues>) => void;
};

export function GiftModeFields({ values, onChange }: GiftModeFieldsProps) {
  if (values.mode === "fixed_quotas") {
    return (
      <FormField label="Número de cotas" hint="Cada cota vale o valor total dividido pelo número de cotas.">
        <input
          type="number"
          min={2}
          max={1000}
          inputMode="numeric"
          value={values.totalQuotas}
          onChange={(event) => onChange({ totalQuotas: event.target.value })}
          className={fieldControlClassName}
        />
      </FormField>
    );
  }
  if (values.mode === "free_amount") {
    return (
      <FormField label="Valor mínimo por contribuição (R$)" hint="Convidados escolhem quanto contribuir, a partir deste valor.">
        <input
          inputMode="decimal"
          placeholder="50,00"
          value={values.minAmount}
          onChange={(event) => onChange({ minAmount: event.target.value })}
          className={fieldControlClassName}
        />
      </FormField>
    );
  }
  return null;
}
