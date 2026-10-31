"use server";

import { getContributionController } from "../handlers/get-contribution-controller";

export async function confirmPixPaymentAction(input: unknown) {
  return getContributionController().confirmPixPayment(input);
}

export async function rejectOrCancelByCoupleAction(input: unknown) {
  return getContributionController().rejectOrCancelByCouple(input);
}

export async function removeContributionAction(input: unknown) {
  return getContributionController().removeContribution(input);
}
