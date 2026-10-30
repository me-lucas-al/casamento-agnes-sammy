export const ROLES = ["admin", "couple", "guest"] as const;

export type Role = (typeof ROLES)[number];

export type SessionUser = {
  id: string;
  role: Role;
  guestId?: string;
};

export function isRole(value: unknown): value is Role {
  return ROLES.some((role) => role === value);
}
