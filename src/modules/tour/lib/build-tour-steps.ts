import type { Role } from "@/modules/auth/types";

export const TOUR_STEP_IDS = [
  "welcome",
  "event",
  "gifts",
  "invite",
  "guest-entry",
  "guest-view",
  "payments",
  "rsvp",
  "moderation",
  "users",
  "final",
] as const;

export type TourStepId = (typeof TOUR_STEP_IDS)[number];

export type TourStepDefinition = {
  id: TourStepId;
  navLabel: string;
  href: string | null;
  hrefLabel: string | null;
};

const ALL_STEPS: readonly (TourStepDefinition & { adminOnly?: boolean })[] = [
  { id: "welcome", navLabel: "Boas-vindas", href: null, hrefLabel: null },
  { id: "event", navLabel: "Evento", href: "/painel/evento", hrefLabel: "Abrir Evento" },
  { id: "gifts", navLabel: "Presentes", href: "/painel/presentes", hrefLabel: "Abrir Presentes" },
  { id: "invite", navLabel: "Convidar", href: "/painel/convidados", hrefLabel: "Abrir Convidados" },
  { id: "guest-entry", navLabel: "Entrada do convidado", href: null, hrefLabel: null },
  { id: "guest-view", navLabel: "Visão do convidado", href: null, hrefLabel: null },
  { id: "payments", navLabel: "Pagamentos", href: "/painel/pagamentos", hrefLabel: "Abrir Pagamentos" },
  { id: "rsvp", navLabel: "Presenças", href: "/painel/presencas", hrefLabel: "Abrir Presenças" },
  { id: "moderation", navLabel: "Recados e fotos", href: "/painel/recados", hrefLabel: "Abrir Recados" },
  { id: "users", navLabel: "Usuários", href: "/painel/usuarios", hrefLabel: "Abrir Usuários", adminOnly: true },
  { id: "final", navLabel: "Começar", href: null, hrefLabel: null },
];

export function buildTourSteps(role: Role): TourStepDefinition[] {
  if (role === "guest") return [];
  return ALL_STEPS.filter((step) => !step.adminOnly || role === "admin").map(
    ({ id, navLabel, href, hrefLabel }) => ({ id, navLabel, href, hrefLabel }),
  );
}
