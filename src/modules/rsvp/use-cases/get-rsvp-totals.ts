import { requireRole } from "@/modules/auth/authorization";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import type { RsvpRepository } from "../repositories/contracts/rsvp-repository";
import type { RsvpTotals } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository };

export function makeGetRsvpTotals({ rsvpRepository }: Dependencies) {
  return async function getRsvpTotals(actor: SessionUser | null): Promise<RsvpTotals> {
    requireRole(actor, PANEL_READER_ROLES);
    return rsvpRepository.calculateTotals();
  };
}
