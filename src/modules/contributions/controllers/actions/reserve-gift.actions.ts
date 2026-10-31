"use server";

import { getContributionController } from "../handlers/get-contribution-controller";

export async function reserveGiftAction(input: unknown) {
  return getContributionController().reserveGift(input);
}

export async function updateReservationAction(input: unknown) {
  return getContributionController().updateReservation(input);
}

export async function cancelOwnReservationAction(input: unknown) {
  return getContributionController().cancelOwnReservation(input);
}
