import type { Role } from "../types";

export type RouteDecision = { type: "allow" } | { type: "redirect"; to: string };

const GUEST_AREA_PREFIXES = [
  "/presentes",
  "/meus-presentes",
  "/confirmar-presenca",
  "/recados",
  "/galeria",
];
const PANEL_PREFIX = "/painel";
const ADMIN_ONLY_PREFIX = "/painel/usuarios";
const ALLOW: RouteDecision = { type: "allow" };

function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function redirectTo(to: string): RouteDecision {
  return { type: "redirect", to };
}

function resolvePanelAccess(pathname: string, role: Role | undefined): RouteDecision {
  if (!role) return redirectTo("/admin/entrar");
  if (role === "guest") return redirectTo("/presentes");
  if (isUnder(pathname, ADMIN_ONLY_PREFIX) && role !== "admin") return redirectTo(PANEL_PREFIX);
  return ALLOW;
}

export function resolveRouteAccess(pathname: string, role: Role | undefined): RouteDecision {
  if (isUnder(pathname, PANEL_PREFIX)) return resolvePanelAccess(pathname, role);
  const isGuestArea = GUEST_AREA_PREFIXES.some((prefix) => isUnder(pathname, prefix));
  if (isGuestArea && !role) return redirectTo("/entrar");
  return ALLOW;
}
