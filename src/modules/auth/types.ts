export const ROLES = ["admin", "couple", "guest", "viewer"] as const;

export type Role = (typeof ROLES)[number];

export type StaffRole = Extract<Role, "admin" | "couple">;

export const VIEWER_USER_ID = "viewer";

export type SessionUser = {
  id: string;
  role: Role;
  guestId?: string;
};

export function isRole(value: unknown): value is Role {
  return ROLES.some((role) => role === value);
}
