"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { createGiftAction, updateGiftAction } from "../controllers/gift.actions";
import {
  buildGiftPayload,
  emptyGiftFormValues,
  giftToFormValues,
  type GiftFormValues,
} from "../lib/gift-form-values";
import type { Gift, GiftCategory, GiftImage } from "../types";
import { FormField, fieldControlClassName } from "./form-field";
import { GiftImageField } from "./gift-image-field";
import { GiftModeFields } from "./gift-mode-fields";

type GiftFormProps = {
  categories: GiftCategory[];
  gift?: Gift;
};

export function GiftForm({ categories, gift }: GiftFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<GiftFormValues>(
    gift ? giftToFormValues(gift) : emptyGiftFormValues(categories[0]?.id ?? ""),
  );
  const [image, setImage] = useState<GiftImage | null | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const change = (changes: Partial<GiftFormValues>) => setValues((current) => ({ ...current, ...changes }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const built = buildGiftPayload(values, image);
    if (!built.ok) return setErrorMessage(built.error);
    setIsSaving(true);
    const result = gift ? await updateGiftAction(gift.id, built.payload) : await createGiftAction(built.payload);
    setIsSaving(false);
    if (!result.ok) return setErrorMessage(result.error);
    router.push("/painel/presentes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl flex-col gap-4">
      <FormField label="Nome">
        <input required minLength={2} value={values.name} onChange={(event) => change({ name: event.target.value })} className={fieldControlClassName} />
      </FormField>
      <FormField label="Descrição">
        <textarea rows={3} value={values.description} onChange={(event) => change({ description: event.target.value })} className={fieldControlClassName} />
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Categoria">
          <select required value={values.categoryId} onChange={(event) => change({ categoryId: event.target.value })} className={fieldControlClassName}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Tipo">
          <select value={values.kind} onChange={(event) => change({ kind: event.target.value === "experience" ? "experience" : "item" })} className={fieldControlClassName}>
            <option value="item">Item</option>
            <option value="experience">Experiência</option>
          </select>
        </FormField>
        <FormField label="Valor total (R$)">
          <input required inputMode="decimal" placeholder="300,00" value={values.price} onChange={(event) => change({ price: event.target.value })} className={fieldControlClassName} />
        </FormField>
        <FormField label="Modo">
          <select value={values.mode} onChange={(event) => change(modeChange(event.target.value))} className={fieldControlClassName}>
            <option value="single">Único (um convidado)</option>
            <option value="fixed_quotas">Cotas fixas</option>
            <option value="free_amount">Valor livre</option>
          </select>
        </FormField>
      </div>
      <GiftModeFields values={values} onChange={change} />
      <FormField label="Ordem na lista">
        <input type="number" min={0} inputMode="numeric" value={values.sortOrder} onChange={(event) => change({ sortOrder: event.target.value })} className={fieldControlClassName} />
      </FormField>
      <GiftImageField currentUrl={gift?.imageUrl ?? null} onImageChange={setImage} />
      <label className="flex items-center gap-2 text-sm text-wine">
        <input type="checkbox" checked={values.isVisible} onChange={(event) => change({ isVisible: event.target.checked })} />
        Visível para os convidados
      </label>
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
      <Button type="submit" disabled={isSaving || categories.length === 0} className="self-start">
        {isSaving ? "Salvando..." : "Salvar presente"}
      </Button>
    </form>
  );
}

function modeChange(modeValue: string): Partial<GiftFormValues> {
  if (modeValue === "fixed_quotas") return { mode: "fixed_quotas" };
  if (modeValue === "free_amount") return { mode: "free_amount" };
  return { mode: "single" };
}
