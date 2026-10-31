import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { GuestRepository } from "../repositories/contracts/guest-repository";
import type { Guest, GuestDetails } from "../types";
import type { GenerateUniqueGuestCode } from "./generate-unique-guest-code";

type Dependencies = {
  guestRepository: GuestRepository;
  generateUniqueGuestCode: GenerateUniqueGuestCode;
};

export function makeCreateGuest({ guestRepository, generateUniqueGuestCode }: Dependencies) {
  return async function createGuest(actor: SessionUser | null, details: GuestDetails): Promise<Guest> {
    const manager = requireRole(actor, ["admin", "couple"]);
    const code = await generateUniqueGuestCode();
    return guestRepository.create({ ...details, code, createdBy: manager.id });
  };
}
