import { FormField, textInputClassName } from "@/shared/ui/forms/form-field";
import type { EventSettingsSnapshot } from "../types";

type PixSettingsFieldsProps = { settings: EventSettingsSnapshot };

const PIX_TYPE_OPTIONS = [
  { value: "", label: "Sem chave Pix" },
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone (+55...)" },
  { value: "random", label: "Chave aleatória" },
];

export function PixSettingsFields({ settings }: PixSettingsFieldsProps) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-xl border border-gold/50 p-4">
      <legend className="px-2 font-heading text-lg italic">Pix</legend>
      <FormField label="Tipo da chave" htmlFor="pixKeyType">
        <select id="pixKeyType" name="pixKeyType" defaultValue={settings.pixKeyType ?? ""} className={textInputClassName}>
          {PIX_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Chave Pix" htmlFor="pixKey">
        <input id="pixKey" name="pixKey" defaultValue={settings.pixKey ?? ""} className={textInputClassName} />
      </FormField>
      <FormField label="Nome do recebedor" htmlFor="pixReceiverName" hint="Máximo de 25 caracteres">
        <input id="pixReceiverName" name="pixReceiverName" maxLength={25} defaultValue={settings.pixReceiverName ?? ""} className={textInputClassName} />
      </FormField>
      <FormField label="Cidade do recebedor" htmlFor="pixCity" hint="Máximo de 15 caracteres">
        <input id="pixCity" name="pixCity" maxLength={15} defaultValue={settings.pixCity ?? ""} className={textInputClassName} />
      </FormField>
    </fieldset>
  );
}
