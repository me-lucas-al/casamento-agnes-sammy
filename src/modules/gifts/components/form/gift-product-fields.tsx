import type { GiftFormValues } from "@/modules/gifts/lib/drafts/gift-form-values";
import { FormField, fieldControlClassName } from "./form-field";

type GiftProductFieldsProps = {
  values: GiftFormValues;
  onChange: (changes: Partial<GiftFormValues>) => void;
  hasUploadedImage: boolean;
};

export function GiftProductFields({ values, onChange, hasUploadedImage }: GiftProductFieldsProps) {
  return (
    <>
      <FormField label="Link do produto na loja" hint="Opcional. Apenas lojas conhecidas, endereço começando com https.">
        <input
          type="url"
          inputMode="url"
          placeholder="https://www.magazineluiza.com.br/..."
          value={values.productUrl}
          onChange={(event) => onChange({ productUrl: event.target.value })}
          className={fieldControlClassName}
        />
      </FormField>
      <FormField label="Preço conferido em" hint="Data em que o preço foi visto na loja.">
        <input
          type="date"
          value={values.priceCheckedAt}
          onChange={(event) => onChange({ priceCheckedAt: event.target.value })}
          className={fieldControlClassName}
        />
      </FormField>
      <FormField
        label="Endereço da foto do produto"
        hint={hasUploadedImage ? "A foto enviada acima tem prioridade." : "Opcional. Use no lugar de enviar uma foto."}
      >
        <input
          type="url"
          inputMode="url"
          disabled={hasUploadedImage}
          placeholder="https://..."
          value={values.externalImageUrl}
          onChange={(event) => onChange({ externalImageUrl: event.target.value })}
          className={fieldControlClassName}
        />
      </FormField>
    </>
  );
}
