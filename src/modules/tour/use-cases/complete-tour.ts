import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { TourUserNotFoundError } from "../errors";
import type { TourRepository } from "../repositories/tour-repository";

type Dependencies = { tourRepository: TourRepository; now: () => Date };

export function makeCompleteTour({ tourRepository, now }: Dependencies) {
  return async function completeTour(actor: SessionUser | null): Promise<void> {
    const user = requireRole(actor, ["admin", "couple"]);
    const wasSaved = await tourRepository.saveCompletedAt(user.id, now());
    if (!wasSaved) throw new TourUserNotFoundError();
  };
}
