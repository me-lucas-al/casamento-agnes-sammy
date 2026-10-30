import type { users } from "./schema";

export type User = typeof users.$inferSelect;

export type UserRole = User["role"];

export type NewUser = {
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
};

export const USER_STATUSES = ["active", "inactive"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export type UserListQuery = {
  limit: number;
  offset: number;
  search: string;
  status?: UserStatus;
};

export type UserListPage = {
  items: User[];
  total: number;
};
