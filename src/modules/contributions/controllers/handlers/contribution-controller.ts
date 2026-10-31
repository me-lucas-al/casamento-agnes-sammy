import type { SessionUser } from "@/modules/auth/types";
import { dashboardTag, giftsTag, pendingPaymentsTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describeContributionError } from "@/modules/contributions/errors";
import type { ContributionModule } from "@/modules/contributions/factory";
import { tagsForContribution } from "@/modules/contributions/lib/caches/contribution-tags";
import {
  confirmPixPaymentSchema,
  contributionIdSchema,
  reserveGiftSchema,
  updateReservationSchema,
} from "@/modules/contributions/schemas/contribution.schemas";
import type { Contribution } from "@/modules/contributions/types";

type Dependencies = {
  contributions: ContributionModule;
  invalidator: CacheInvalidator;
  getActor: () => Promise<SessionUser | null>;
};

type MutationResult = ActionResult<{ contributionId: string }>;

export function createContributionController({ contributions, invalidator, getActor }: Dependencies) {
  async function mutate(
    execute: (actor: SessionUser | null) => Promise<Contribution>,
  ): Promise<MutationResult> {
    return safeAction(describeContributionError, async () => {
      const contribution = await execute(await getActor());
      invalidator.invalidateTags(tagsForContribution(contribution));
      return success({ contributionId: contribution.id });
    }, "contributionMutation");
  }

  return {
    async reserveGift(input: unknown): Promise<MutationResult> {
      const parsed = reserveGiftSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) => contributions.reserveGift(actor, parsed.data));
    },
    async updateReservation(input: unknown): Promise<MutationResult> {
      const parsed = updateReservationSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) => contributions.updateReservation(actor, parsed.data));
    },
    async cancelOwnReservation(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) =>
        contributions.cancelOwnReservation(actor, parsed.data.contributionId),
      );
    },
    async confirmPixPayment(input: unknown): Promise<MutationResult> {
      const parsed = confirmPixPaymentSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) => contributions.confirmPixPayment(actor, parsed.data));
    },
    async rejectOrCancelByCouple(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) =>
        contributions.rejectOrCancelByCouple(actor, parsed.data.contributionId),
      );
    },
    async removeContribution(input: unknown): Promise<MutationResult> {
      const parsed = contributionIdSchema.safeParse(input);
      if (!parsed.success) return invalidInput(parsed);
      return mutate((actor) => contributions.removeContribution(actor, parsed.data.contributionId));
    },
    async expireReservations(): Promise<number> {
      const expiredCount = await contributions.expireReservations();
      if (expiredCount > 0) invalidator.invalidateTags([giftsTag(), pendingPaymentsTag(), dashboardTag()]);
      return expiredCount;
    },
  };
}

export type ContributionController = ReturnType<typeof createContributionController>;
