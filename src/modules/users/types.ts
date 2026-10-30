import type { users } from "./schema";

export type User = typeof users.$inferSelect;

export type UserRole = User["role"];

export type NewUser = {
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
};

export type UserListQuery = {
  limit: number;
  offset: number;
  search: string;
};

export type UserListPage = {
  items: User[];
  total: number;
};
