import type { Role } from "@/modules/auth/types";
import type { NavItem } from "./nav-links";

const PANEL_ITEMS: readonly (NavItem & { adminOnly?: boolean })[] = [
  { href: "/painel/convidados", label: "Convidados" },
  { href: "/painel/presentes", label: "Presentes" },
  { href: "/painel/pagamentos", label: "Pagamentos" },
  { href: "/painel/presencas", label: "Presenças" },
  { href: "/painel/recados", label: "Recados" },
  { href: "/painel/fotos", label: "Fotos" },
  { href: "/painel/usuarios", label: "Usuários", adminOnly: true },
  { href: "/painel/evento", label: "Evento" },
];

export const GUEST_NAV_ITEMS: readonly NavItem[] = [
  { href: "/presentes", label: "Presentes" },
  { href: "/meus-presentes", label: "Meus presentes" },
  { href: "/confirmar-presenca", label: "Confirmar presença" },
  { href: "/recados", label: "Recados" },
  { href: "/galeria", label: "Galeria" },
];

export function panelNavItemsFor(role: Role): readonly NavItem[] {
  return PANEL_ITEMS.filter((item) => !item.adminOnly || role === "admin");
}
