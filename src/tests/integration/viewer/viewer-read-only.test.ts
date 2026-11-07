import { describe, expect, it } from "vitest";
import { ViewerReadOnlyError } from "@/modules/auth/errors";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildViewerContext, viewer } from "./viewer-test-context";

type Operation = (...args: never[]) => unknown;

async function runAsViewer(operation: Operation): Promise<unknown> {
  return Reflect.apply(operation, undefined, [viewer, {}, {}, {}]);
}

describe("viewer is read-only", () => {
  const testDatabase = useTestDatabase();
  const context = () => buildViewerContext(testDatabase.db);

  function writeOperations(): ReadonlyArray<readonly [string, Operation]> {
    const modules = context();
    return [
      ["guests.createGuest", modules.guestModule.createGuest],
      ["guests.updateGuest", modules.guestModule.updateGuest],
      ["guests.deleteGuest", modules.guestModule.deleteGuest],
      ["guests.regenerateGuestCode", modules.guestModule.regenerateGuestCode],
      ["users.createUser", modules.userModule.createUser],
      ["users.setUserActive", modules.userModule.setUserActive],
      ["gifts.createGiftCategory", modules.giftModule.createGiftCategory],
      ["gifts.updateGiftCategory", modules.giftModule.updateGiftCategory],
      ["gifts.deleteGiftCategory", modules.giftModule.deleteGiftCategory],
      ["gifts.createGift", modules.giftModule.createGift],
      ["gifts.updateGift", modules.giftModule.updateGift],
      ["gifts.deleteGift", modules.giftModule.deleteGift],
      ["gifts.signGiftImageUpload", modules.giftModule.signGiftImageUpload],
      ["suggestions.addSuggestedGifts", modules.suggestionModule.addSuggestedGifts],
      ["contributions.reserveGift", modules.contributionModule.reserveGift],
      ["contributions.updateReservation", modules.contributionModule.updateReservation],
      ["contributions.cancelOwnReservation", modules.contributionModule.cancelOwnReservation],
      ["contributions.confirmPixPayment", modules.contributionModule.confirmPixPayment],
      ["contributions.rejectOrCancelByCouple", modules.contributionModule.rejectOrCancelByCouple],
      ["contributions.removeContribution", modules.contributionModule.removeContribution],
      ["messages.sendMessage", modules.messageModule.sendMessage],
      ["messages.moderateMessage", modules.messageModule.moderateMessage],
      ["messages.updateMessage", modules.messageModule.updateMessage],
      ["messages.deleteMessage", modules.messageModule.deleteMessage],
      ["gallery.signUploadPhoto", modules.galleryModule.signUploadPhoto],
      ["gallery.registerUploadedPhoto", modules.galleryModule.registerUploadedPhoto],
      ["gallery.approvePhoto", modules.galleryModule.approvePhoto],
      ["gallery.updatePhotoCaption", modules.galleryModule.updatePhotoCaption],
      ["gallery.rejectPhoto", modules.galleryModule.rejectPhoto],
      ["gallery.deletePhoto", modules.galleryModule.deletePhoto],
      ["rsvp.submitRsvp", modules.rsvpModule.submitRsvp],
      ["rsvp.deleteRsvp", modules.rsvpModule.deleteRsvp],
      ["event.updateEventSettings", modules.eventModule.updateEventSettings],
      ["event.resetEventSettings", modules.eventModule.resetEventSettings],
      ["profile.updateOwnProfile", modules.profileModule.updateOwnProfile],
      ["tour.completeTour", modules.tourModule.completeTour],
      ["tour.restartTour", modules.tourModule.restartTour],
    ];
  }

  it("rejects every write operation with ViewerReadOnlyError", async () => {
    for (const [name, operation] of writeOperations()) {
      const outcome = await runAsViewer(operation).then(
        () => `${name} succeeded`,
        (error: unknown) => (error instanceof ViewerReadOnlyError ? "rejected" : `${name} threw ${String(error)}`),
      );
      expect(outcome, name).toBe("rejected");
    }
  });
});
