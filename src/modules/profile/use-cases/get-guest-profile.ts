import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { ProfileNotFoundError } from "../errors";
import type { ProfileRepository } from "../repositories/profile-repository";
import type { GuestProfile } from "../types";

type Dependencies = { profileRepository: ProfileRepository };

export function makeGetGuestProfile({ profileRepository }: Dependencies) {
  return async function getGuestProfile(actor: SessionUser | null, guestId: string): Promise<GuestProfile> {
    const user = requireRole(actor, ["admin", "couple", "guest"]);
    if (user.role === "guest" && user.guestId !== guestId) throw new ForbiddenError();
    const profile = await profileRepository.findGuestProfile(guestId);
    if (!profile) throw new ProfileNotFoundError();
    return profile;
  };
}
