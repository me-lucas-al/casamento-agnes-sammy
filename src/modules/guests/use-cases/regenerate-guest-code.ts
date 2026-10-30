import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GuestNotFoundError } from "../errors";
import type { GuestRepository } from "../repositories/guest-repository";
import type { Guest } from "../types";
import type { GenerateUniqueGuestCode } from "./generate-unique-guest-code";

type Dependencies = {
  guestRepository: GuestRepository;
  generateUniqueGuestCode: GenerateUniqueGuestCode;
};

export function makeRegenerateGuestCode({ guestRepository, generateUniqueGuestCode }: Dependencies) {
  return async function regenerateGuestCode(actor: SessionUser | null, guestId: string): Promise<Guest> {
    requireRole(actor, ["admin", "couple"]);
    const code = await generateUniqueGuestCode();
    const guest = await guestRepository.updateCode(guestId, code);
    if (!guest) throw new GuestNotFoundError();
    return guest;
  };
}
