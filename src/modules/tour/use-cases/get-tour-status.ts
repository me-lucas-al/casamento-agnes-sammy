import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { TourUserNotFoundError } from "../errors";
import type { TourRepository } from "../repositories/tour-repository";
import type { TourStatus } from "../types";

type Dependencies = { tourRepository: TourRepository };

export function makeGetTourStatus({ tourRepository }: Dependencies) {
  return async function getTourStatus(actor: SessionUser | null): Promise<TourStatus> {
    const user = requireRole(actor, ["admin", "couple"]);
    const record = await tourRepository.findCompletedAt(user.id);
    if (!record) throw new TourUserNotFoundError();
    return { isCompleted: record.completedAt !== null, completedAt: record.completedAt };
  };
}
