"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import {
  createGiftCategoryAction,
  deleteGiftCategoryAction,
  updateGiftCategoryAction,
} from "../controllers/gift-category.actions";
import type { GiftCategory } from "../types";
import { fieldControlClassName } from "./form-field";

type CategoryRowProps = { category: GiftCategory; onFailure: (message: string) => void };

function CategoryRow({ category, onFailure }: CategoryRowProps) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder));

  async function finish(result: { ok: boolean; error?: string }) {
    if (!result.ok) return onFailure(result.error ?? "Erro.");
    onFailure("");
    router.refresh();
  }

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-gold/40 bg-white p-3 sm:flex-row sm:items-center">
      <input aria-label="Nome" value={name} onChange={(event) => setName(event.target.value)} className={fieldControlClassName} />
      <input aria-label="Ordem" type="number" min={0} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className={`${fieldControlClassName} sm:w-24`} />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={async () => finish(await updateGiftCategoryAction(category.id, { name, sortOrder: Number(sortOrder) || 0 }))}>
          Salvar
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={async () => finish(await deleteGiftCategoryAction(category.id))}>
          Excluir
        </Button>
      </div>
    </li>
  );
}

export function GiftCategoryManager({ categories }: { categories: GiftCategory[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    const result = await createGiftCategoryAction({ name: newName, sortOrder: categories.length });
    if (!result.ok) return setErrorMessage(result.error);
    setNewName("");
    setErrorMessage("");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
        <input required minLength={2} placeholder="Nova categoria" aria-label="Nova categoria" value={newName} onChange={(event) => setNewName(event.target.value)} className={fieldControlClassName} />
        <Button type="submit">Adicionar</Button>
      </form>
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
      <ul className="flex flex-col gap-2">
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} onFailure={setErrorMessage} />
        ))}
      </ul>
    </div>
  );
}
