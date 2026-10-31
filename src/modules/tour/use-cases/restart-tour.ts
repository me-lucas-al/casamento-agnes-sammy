import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { TourUserNotFoundError } from "../errors";
import type { TourRepository } from "../repositories/contracts/tour-repository";

type Dependencies = { tourRepository: TourRepository };

export function makeRestartTour({ tourRepository }: Dependencies) {
  return async function restartTour(actor: SessionUser | null): Promise<void> {
    const user = requireRole(actor, ["admin", "couple"]);
    const wasSaved = await tourRepository.saveCompletedAt(user.id, null);
    if (!wasSaved) throw new TourUserNotFoundError();
  };
}
