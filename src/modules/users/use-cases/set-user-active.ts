import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { CannotDeactivateSelfError, LastAdminError, UserNotFoundError } from "../errors";
import type { UserRepository } from "../repositories/contracts/user-repository";
import type { User } from "../types";

type Dependencies = { userRepository: UserRepository };

export function makeSetUserActive({ userRepository }: Dependencies) {
  return async function setUserActive(
    actor: SessionUser | null,
    userId: string,
    isActive: boolean,
  ): Promise<User> {
    requireRole(actor, ["admin"]);
    const user = await userRepository.findById(userId);
    if (!user) throw new UserNotFoundError();
    if (!isActive && actor?.id === userId) throw new CannotDeactivateSelfError();
    const isDeactivatingActiveAdmin = !isActive && user.role === "admin" && user.isActive;
    if (isDeactivatingActiveAdmin && (await userRepository.countActiveAdmins()) <= 1) {
      throw new LastAdminError();
    }
    const updatedUser = await userRepository.setActive(userId, isActive);
    if (!updatedUser) throw new UserNotFoundError();
    return updatedUser;
  };
}
