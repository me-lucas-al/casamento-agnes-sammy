import { ForbiddenError, UnauthenticatedError, ViewerReadOnlyError } from "./errors";
import type { Role, SessionUser } from "./types";

export function hasRole(user: SessionUser | null, allowedRoles: readonly Role[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function requireRole(
  user: SessionUser | null | undefined,
  allowedRoles: readonly Role[],
): SessionUser {
  if (!user) throw new UnauthenticatedError();
  if (allowedRoles.includes(user.role)) return user;
  if (user.role === "viewer") throw new ViewerReadOnlyError();
  throw new ForbiddenError();
}
