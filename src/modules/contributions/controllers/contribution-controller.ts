import type { SessionUser } from "@/modules/auth/types";
import { giftsTag, pendingPaymentsTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeContributionError } from "../errors";
import type { ContributionModule } from "../factory";
import { tagsForContribution } from "../lib/contribution-tags";
import {
  confirmPixPaymentSchema,
  contributionIdSchema,
  reserveGiftSchema,
  updateReservationSchema,
} from "../schemas/contribution.schemas";
import type { Contribution } from "../types";

type Dependencies = {
  contributions: ContributionModule;
  invalidator: CacheInvalidator;
  getActor: () => Promise<SessionUser | null>;
};

type MutationResult = ActionResult<{ contributionId: string }>;

const INVALID_INPUT_MESSAGE = "Dados inválidos.";

export function createContributionController({ contributions, invalidator, getActor }: Dependencies) {
  async function mutate(
    execute: (actor: SessionUser | null) => Promise<Contribution>,
  ): Promise<MutationResult> {
    try {
      const contribution = await execute(await getActor());
      invalidator.invalidateTags(tagsForContribution(contribution));
      return success({ contributionId: contribution.id });
    } catch (error) {
      return failure(describeContributionError(error));
    }
  }

  return {
    async reserveGift(input: unknown): Promise<MutationResult> {
      const parsed = reserveGiftSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) => contributions.reserveGift(actor, parsed.data));
    },
    async updateReservation(input: unknown): Promise<MutationResult> {
      const parsed = updateReservationSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) => contributions.updateReservation(actor, parsed.data));
    },
    async cancelOwnReservation(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) =>
        contributions.cancelOwnReservation(actor, parsed.data.contributionId),
      );
    },
    async confirmPixPayment(input: unknown): Promise<MutationResult> {
      const parsed = confirmPixPaymentSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) => contributions.confirmPixPayment(actor, parsed.data));
    },
    async rejectOrCancelByCouple(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) =>
        contributions.rejectOrCancelByCouple(actor, parsed.data.contributionId),
      );
    },
    async removeContribution(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return failure(INVALID_INPUT_MESSAGE);
      return mutate((actor) => contributions.removeContribution(actor, parsed.data.contributionId));
    },
    async expireReservations(): Promise<number> {
      const expiredCount = await contributions.expireReservations();
      if (expiredCount > 0) invalidator.invalidateTags([giftsTag(), pendingPaymentsTag()]);
      return expiredCount;
    },
  };
}

export type ContributionController = ReturnType<typeof createContributionController>;
