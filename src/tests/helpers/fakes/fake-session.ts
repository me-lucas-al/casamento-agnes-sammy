import { randomUUID } from "node:crypto";
import type { Role, SessionUser } from "@/modules/auth/types";

export function asUser(role: Role, overrides: Partial<SessionUser> = {}): SessionUser {
  const id = overrides.id ?? randomUUID();
  const guestId = role === "guest" ? (overrides.guestId ?? id) : overrides.guestId;
  return { id, role, guestId, ...overrides };
}
