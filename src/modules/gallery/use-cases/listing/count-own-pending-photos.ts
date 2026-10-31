import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";

type Dependencies = { photoRepository: PhotoRepository };

export function makeCountOwnPendingPhotos({ photoRepository }: Dependencies) {
  return async function countOwnPendingPhotos(actor: SessionUser | null): Promise<number> {
    const user = requireRole(actor, ["guest"]);
    if (!user.guestId) return 0;
    return photoRepository.countPendingByGuest(user.guestId);
  };
}
