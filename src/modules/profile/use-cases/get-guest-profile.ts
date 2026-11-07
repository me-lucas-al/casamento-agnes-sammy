import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { GUEST_AREA_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { ProfileNotFoundError } from "../errors";
import { VIEWER_GUEST_PROFILE } from "../lib/viewer-guest-profile";
import type { ProfileRepository } from "../repositories/contracts/profile-repository";
import type { GuestProfile } from "../types";

type Dependencies = { profileRepository: ProfileRepository };

export function makeGetGuestProfile({ profileRepository }: Dependencies) {
  return async function getGuestProfile(actor: SessionUser | null, guestId: string): Promise<GuestProfile> {
    const user = requireRole(actor, GUEST_AREA_READER_ROLES);
    if (isViewer(user)) return VIEWER_GUEST_PROFILE;
    if (user.role === "guest" && user.guestId !== guestId) throw new ForbiddenError();
    const profile = await profileRepository.findGuestProfile(guestId);
    if (!profile) throw new ProfileNotFoundError();
    return profile;
  };
}
