import { Button } from "@/shared/ui/primitives/button";
import type { GuestSort } from "../types";

type GuestsToolbarProps = {
  search: string;
  sort: GuestSort;
};

const sortLabels: Record<GuestSort, string> = {
  recent: "Mais recentes",
  name: "Nome (A-Z)",
  access: "Último acesso",
};

export function GuestsToolbar({ search, sort }: GuestsToolbarProps) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <label className="grid flex-1 gap-1 text-sm">
        Buscar
        <input
          name="search"
          defaultValue={search}
          placeholder="Nome, código ou telefone"
          className="h-9 rounded-lg border bg-background px-3 text-sm"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Ordenar
        <select name="sort" defaultValue={sort} className="h-9 rounded-lg border bg-background px-3 text-sm">
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit">Filtrar</Button>
    </form>
  );
}
