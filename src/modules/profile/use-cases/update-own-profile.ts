import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { RsvpDeadlinePassedError } from "@/modules/rsvp/errors";
import { assertCompanionsFitSeats, normalizeCompanions } from "@/modules/rsvp/lib/validate-companions";
import type { Companion } from "@/modules/rsvp/types";
import { ProfileNotFoundError } from "../errors";
import type { ProfileRepository } from "../repositories/profile-repository";
import type { GuestProfile, OwnProfileChanges } from "../types";

type Dependencies = { profileRepository: ProfileRepository; now: () => Date };

function describeRelatives(relatives: readonly Companion[]): string {
  return JSON.stringify(relatives.map(({ name, dietaryNote }) => [name, dietaryNote ?? null]));
}

export function makeUpdateOwnProfile({ profileRepository, now }: Dependencies) {
  return async function updateOwnProfile(
    actor: SessionUser | null,
    changes: OwnProfileChanges,
  ): Promise<GuestProfile> {
    const user = requireRole(actor, ["guest"]);
    if (!user.guestId) throw new ForbiddenError();
    const current = await profileRepository.findGuestProfile(user.guestId);
    if (!current) throw new ProfileNotFoundError();
    const relatives = normalizeCompanions(changes.relatives);
    assertCompanionsFitSeats(relatives, current.seats);
    const relativesChanged = describeRelatives(relatives) !== describeRelatives(current.relatives);
    const deadline = relativesChanged ? await profileRepository.findRsvpDeadline() : null;
    if (deadline && now() > deadline) throw new RsvpDeadlinePassedError();
    await profileRepository.saveOwnProfile({
      ...changes,
      relatives,
      guestId: current.guestId,
      completedAt: now(),
    });
    const updated = await profileRepository.findGuestProfile(current.guestId);
    if (!updated) throw new ProfileNotFoundError();
    return updated;
  };
}
