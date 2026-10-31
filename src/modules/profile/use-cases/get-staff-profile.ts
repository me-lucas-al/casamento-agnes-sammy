import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { ProfileNotFoundError } from "../errors";
import type { ProfileRepository } from "../repositories/contracts/profile-repository";
import type { StaffProfile } from "../types";

type Dependencies = { profileRepository: ProfileRepository };

export function makeGetStaffProfile({ profileRepository }: Dependencies) {
  return async function getStaffProfile(actor: SessionUser | null): Promise<StaffProfile> {
    const user = requireRole(actor, ["admin", "couple"]);
    const profile = await profileRepository.findStaffProfile(user.id);
    if (!profile) throw new ProfileNotFoundError();
    return profile;
  };
}
