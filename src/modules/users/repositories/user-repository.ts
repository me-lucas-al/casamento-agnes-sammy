import type { NewUser, User, UserListPage, UserListQuery } from "../types";

export interface UserRepository {
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findActiveByEmail(email: string): Promise<User | null>;
  create(newUser: NewUser): Promise<User>;
  setActive(userId: string, isActive: boolean): Promise<User | null>;
  countActiveAdmins(): Promise<number>;
  listPage(query: UserListQuery): Promise<UserListPage>;
}
