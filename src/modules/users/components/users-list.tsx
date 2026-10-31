import type { User } from "../types";
import { ToggleUserActiveButton } from "./toggle-user-active-button";

const roleLabels: Record<User["role"], string> = {
  admin: "Administrador",
  couple: "Noivos",
};

export function UsersList({ users }: { users: User[] }) {
  return (
    <ul className="grid gap-3">
      {users.map((user) => (
        <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm">
              {roleLabels[user.role]} · {user.isActive ? "Ativo" : "Inativo"}
            </p>
          </div>
          <ToggleUserActiveButton userId={user.id} userName={user.name} isActive={user.isActive} />
        </li>
      ))}
    </ul>
  );
}
