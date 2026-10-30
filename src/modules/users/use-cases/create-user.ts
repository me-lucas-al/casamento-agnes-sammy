import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { EmailAlreadyRegisteredError } from "../errors";
import type { UserRepository } from "../repositories/user-repository";
import type { NewUser, User } from "../types";

type Dependencies = { userRepository: UserRepository };

export function makeCreateUser({ userRepository }: Dependencies) {
  return async function createUser(actor: SessionUser | null, newUser: NewUser): Promise<User> {
    requireRole(actor, ["admin"]);
    const email = newUser.email.trim().toLowerCase();
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new EmailAlreadyRegisteredError();
    return userRepository.create({ ...newUser, email });
  };
}
