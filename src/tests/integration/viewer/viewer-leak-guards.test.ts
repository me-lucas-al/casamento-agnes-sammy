import { describe, expect, it } from "vitest";
import { GiftNotFoundError } from "@/modules/contributions/errors";
import { messages, rsvpCompanions } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildViewerContext, FIRST_PAGE, viewer } from "./viewer-test-context";

describe("viewer cannot rebuild masked data", () => {
  const testDatabase = useTestDatabase();
  const context = () => buildViewerContext(testDatabase.db);

  it("ignores the RSVP search so a masked surname cannot be probed", async () => {
    await seedGuest(testDatabase.db, { name: "Maria Souza Lima" });
    await seedGuest(testDatabase.db, { name: "João Alves" });

    const probed = await context().rsvpModule.listRsvpsPage(viewer, {
      ...FIRST_PAGE,
      status: undefined,
      search: "Souza Li",
    });

    expect(probed.total).toBe(2);
  });

  it("ignores the payments search so a masked surname cannot be probed", async () => {
    const maria = await seedGuest(testDatabase.db, { name: "Maria Souza Lima" });
    const joao = await seedGuest(testDatabase.db, { name: "João Alves" });
    await seedContribution(testDatabase.db, { guestId: maria.id });
    await seedContribution(testDatabase.db, { guestId: joao.id });

    const probed = await context().contributionModule.listPendingPayments(viewer, {
      ...FIRST_PAGE,
      status: "all",
      search: "Souza Li",
      sort: "newest",
    });

    expect(probed.total).toBe(2);
  });

  it("masks the author of approved messages for the visitor but not for guests", async () => {
    const guest = await seedGuest(testDatabase.db, { name: "Maria Souza Lima" });
    await testDatabase.db
      .insert(messages)
      .values({ guestId: guest.id, authorName: "Maria Souza Lima", body: "Parabéns", status: "approved" });
    const { messageModule } = context();

    const asViewer = await messageModule.listApprovedMessagesPage(viewer, FIRST_PAGE);
    const asGuest = await messageModule.listApprovedMessagesPage(asUser("guest", { guestId: guest.id }), FIRST_PAGE);

    expect(asViewer.items.map((message) => message.authorName)).toEqual(["Maria L."]);
    expect(asGuest.items.map((message) => message.authorName)).toEqual(["Maria Souza Lima"]);
  });

  it("shows the real RSVP of a row masked, never the demo guest", async () => {
    const guest = await seedGuest(testDatabase.db, { name: "Maria Souza Lima", seats: 2 });
    await testDatabase.db.insert(rsvpCompanions).values({ guestId: guest.id, name: "João Souza", dietaryNote: "Vegano" });

    const detail = await context().rsvpModule.getGuestRsvp(viewer, guest.id);

    expect(detail).toMatchObject({ guestId: guest.id, guestName: "Maria L.", dietaryNote: null });
    expect(detail.companions).toEqual([{ name: "Acompanhante", dietaryNote: null }]);
  });

  it("hides a hidden gift from the visitor like it does for guests", async () => {
    const hiddenGift = await seedGift(testDatabase.db, { isVisible: false });
    const { contributionModule } = context();

    await expect(contributionModule.getGiftAvailability(viewer, hiddenGift.id)).rejects.toBeInstanceOf(GiftNotFoundError);
    await expect(contributionModule.getGiftAvailability(asUser("couple"), hiddenGift.id)).resolves.toBeDefined();
  });
});
