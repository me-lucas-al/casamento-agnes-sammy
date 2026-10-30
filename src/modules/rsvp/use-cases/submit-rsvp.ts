import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { RsvpDeadlinePassedError, RsvpGuestNotFoundError } from "../errors";
import { assertCompanionsFitSeats, normalizeCompanions } from "../lib/validate-companions";
import type { RsvpRepository } from "../repositories/rsvp-repository";
import type { Companion, RsvpAnswer } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository; now: () => Date };

export type SubmitRsvpInput = {
  guestId: string;
  status: RsvpAnswer;
  dietaryNote: string | null;
  companions: Companion[];
};

export function makeSubmitRsvp({ rsvpRepository, now }: Dependencies) {
  async function assertDeadlineAllows(actor: SessionUser): Promise<void> {
    if (actor.role !== "guest") return;
    const deadline = await rsvpRepository.findDeadline();
    if (deadline && now() > deadline) throw new RsvpDeadlinePassedError();
  }

  return async function submitRsvp(actor: SessionUser | null, input: SubmitRsvpInput): Promise<void> {
    const user = requireRole(actor, ["admin", "couple", "guest"]);
    if (user.role === "guest" && user.guestId !== input.guestId) throw new ForbiddenError();
    const guestRsvp = await rsvpRepository.findGuestRsvp(input.guestId);
    if (!guestRsvp) throw new RsvpGuestNotFoundError();
    await assertDeadlineAllows(user);
    const companions = input.status === "going" ? normalizeCompanions(input.companions) : [];
    assertCompanionsFitSeats(companions, guestRsvp.seats);
    await rsvpRepository.save({
      guestId: input.guestId,
      status: input.status,
      dietaryNote: input.dietaryNote,
      companions,
      respondedAt: now(),
    });
  };
}
