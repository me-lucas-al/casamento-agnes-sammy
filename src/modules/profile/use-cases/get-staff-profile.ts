import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { ProfileNotFoundError } from "../errors";
import { VIEWER_STAFF_PROFILE } from "../lib/viewer-staff-profile";
import type { ProfileRepository } from "../repositories/contracts/profile-repository";
import type { StaffProfile } from "../types";

type Dependencies = { profileRepository: ProfileRepository };

export function makeGetStaffProfile({ profileRepository }: Dependencies) {
  return async function getStaffProfile(actor: SessionUser | null): Promise<StaffProfile> {
    const user = requireRole(actor, PANEL_READER_ROLES);
    if (isViewer(user)) return VIEWER_STAFF_PROFILE;
    const profile = await profileRepository.findStaffProfile(user.id);
    if (!profile) throw new ProfileNotFoundError();
    return profile;
  };
}
