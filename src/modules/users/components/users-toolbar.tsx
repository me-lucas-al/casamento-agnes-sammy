import { Button } from "@/shared/ui/button";
import type { UserStatus } from "../types";

type UsersToolbarProps = {
  search: string;
  status: UserStatus | undefined;
};

export function UsersToolbar({ search, status }: UsersToolbarProps) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <label className="grid flex-1 gap-1 text-sm">
        Buscar
        <input
          name="search"
          defaultValue={search}
          placeholder="Nome ou e-mail"
          className="h-9 rounded-lg border bg-background px-3 text-sm"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Status
        <select name="status" defaultValue={status ?? ""} className="h-9 rounded-lg border bg-background px-3 text-sm">
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </label>
      <Button type="submit">Filtrar</Button>
    </form>
  );
}
