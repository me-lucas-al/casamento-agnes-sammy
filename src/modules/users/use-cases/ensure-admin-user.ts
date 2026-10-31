import type { UserRepository } from "../repositories/contracts/user-repository";
import type { User } from "../types";

type Dependencies = { userRepository: UserRepository };

type Input = { name: string; email: string };

export function makeEnsureAdminUser({ userRepository }: Dependencies) {
  return async function ensureAdminUser({ name, email }: Input): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) return existingUser;
    return userRepository.create({ name, email: normalizedEmail, role: "admin" });
  };
}
