import { MockBadge } from "./mock-badge";
import { MockField } from "./mock-field";
import { PanelWindow } from "./panel-window";

export function UsersMockup() {
  return (
    <PanelWindow title="Usuários" label="Exemplo da tela de usuários, só para administradores">
      <div className="grid grid-cols-2 gap-2">
        <MockField label="Nome" value="Agnes" />
        <MockField label="Papel" value="Noivo(a)" />
        <MockField label="E-mail da conta Google" value="agnes@gmail.com" isHighlighted className="col-span-2" />
      </div>
      <p className="text-sm">A pessoa entra pelo botão Google, usando exatamente este e-mail.</p>
      <ul className="flex flex-col gap-1.5">
        <li className="flex items-center justify-between gap-2 rounded-xl border border-gold/40 bg-paper px-3 py-2 text-base">
          Sammy <MockBadge tone="success">Ativo</MockBadge>
        </li>
        <li className="flex items-center justify-between gap-2 rounded-xl border border-gold/40 bg-paper px-3 py-2 text-base">
          Administrador <MockBadge tone="neutral">Admin</MockBadge>
        </li>
      </ul>
    </PanelWindow>
  );
}
