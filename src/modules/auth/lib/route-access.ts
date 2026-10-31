import type { Role } from "../types";

export type RouteDecision = { type: "allow" } | { type: "redirect"; to: string };

const GUEST_AREA_PREFIXES = [
  "/inicio",
  "/convite",
  "/casamento",
  "/perfil",
  "/presentes",
  "/meus-presentes",
  "/confirmar-presenca",
  "/recados",
  "/galeria",
];
const PANEL_PREFIX = "/painel";
const ADMIN_ONLY_PREFIX = "/painel/usuarios";
const LOGIN_ROUTE = "/";
const COUPLE_LOGIN_ROUTE = "/?aba=noivos";
const ALLOW: RouteDecision = { type: "allow" };

function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function redirectTo(to: string): RouteDecision {
  return { type: "redirect", to };
}

function resolvePanelAccess(pathname: string, role: Role | undefined): RouteDecision {
  if (!role) return redirectTo(COUPLE_LOGIN_ROUTE);
  if (role === "guest") return redirectTo(resolveHomeRoute(role));
  if (isUnder(pathname, ADMIN_ONLY_PREFIX) && role !== "admin") return redirectTo(PANEL_PREFIX);
  return ALLOW;
}

export function resolveRouteAccess(pathname: string, role: Role | undefined): RouteDecision {
  if (isUnder(pathname, PANEL_PREFIX)) return resolvePanelAccess(pathname, role);
  const isGuestArea = GUEST_AREA_PREFIXES.some((prefix) => isUnder(pathname, prefix));
  if (isGuestArea && !role) return redirectTo(LOGIN_ROUTE);
  return ALLOW;
}

export function resolveRedirectDestination(pathname: string, role: Role | undefined): string | null {
  const decision = resolveRouteAccess(pathname, role);
  return decision.type === "redirect" ? decision.to : null;
}

export function resolveHomeRoute(role: Role): string {
  return role === "guest" ? "/inicio" : PANEL_PREFIX;
}
