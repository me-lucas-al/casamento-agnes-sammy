import { describe, expect, it } from "vitest";
import { messages } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { seedAdmin } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildViewerContext, FIRST_PAGE, viewer } from "./viewer-test-context";

const SECRET_CODE = "K7M2QX9P";

describe("viewer reads with masked personal data", () => {
  const testDatabase = useTestDatabase();
  const context = () => buildViewerContext(testDatabase.db);

  async function seedMaria() {
    return seedGuest(testDatabase.db, {
      name: "Maria Souza Lima",
      code: SECRET_CODE,
      phone: "11987654321",
      email: "maria@example.com",
    });
  }

  it("masks guest name, code, phone and email", async () => {
    await seedMaria();

    const page = await context().guestModule.listGuestsPage(viewer, { ...FIRST_PAGE, search: "", sort: "recent" });

    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({
      name: "Maria L.",
      code: "••••••••",
      phone: "•••••••••21",
      email: "m••••@example.com",
    });
    expect(JSON.stringify(page)).not.toContain(SECRET_CODE);
  });

  it("ignores the search so codes cannot be discovered by probing", async () => {
    await seedMaria();
    await seedGuest(testDatabase.db, { name: "João Alves" });

    const probed = await context().guestModule.listGuestsPage(viewer, {
      ...FIRST_PAGE,
      search: "K7M2",
      sort: "recent",
    });

    expect(probed.total).toBe(2);
  });

  it("keeps real data for the couple", async () => {
    await seedMaria();

    const page = await context().guestModule.listGuestsPage(asUser("couple"), {
      ...FIRST_PAGE,
      search: "",
      sort: "recent",
    });

    expect(page.items[0]).toMatchObject({ name: "Maria Souza Lima", code: SECRET_CODE });
  });

  it("masks guest names in the RSVP list and still shows the totals", async () => {
    await seedMaria();
    const { rsvpModule } = context();

    const page = await rsvpModule.listRsvpsPage(viewer, { ...FIRST_PAGE, status: undefined, search: "" });
    const totals = await rsvpModule.getRsvpTotals(viewer);

    expect(page.items[0]?.guestName).toBe("Maria L.");
    expect(totals.pending).toBe(1);
  });

  it("masks the author of moderation messages and shows approved ones", async () => {
    const guest = await seedMaria();
    await testDatabase.db.insert(messages).values([
      { guestId: guest.id, authorName: "Maria Souza Lima", body: "Oi" },
      { guestId: guest.id, authorName: "Maria Souza Lima", body: "Parabéns", status: "approved" },
    ]);
    const { messageModule } = context();

    const panel = await messageModule.listMessagesPage(viewer, { ...FIRST_PAGE, status: undefined });
    const approved = await messageModule.listApprovedMessagesPage(viewer, FIRST_PAGE);

    expect(panel.items.map((message) => message.authorName)).toEqual(["Maria L.", "Maria L."]);
    expect(approved.items).toHaveLength(1);
  });

  it("masks the guest name in the payments list", async () => {
    const guest = await seedMaria();
    await seedContribution(testDatabase.db, { guestId: guest.id });

    const page = await context().contributionModule.listPendingPayments(viewer, {
      ...FIRST_PAGE,
      status: "all",
      search: "",
      sort: "newest",
    });

    expect(page.items.map((payment) => payment.guestName)).toEqual(["Maria L."]);
  });

  it("masks staff names and emails and hides the photo", async () => {
    await seedAdmin(testDatabase.db, {
      name: "Lucas Souza",
      email: "lucas@gmail.com",
      image: "https://example.com/a.png",
    });

    const page = await context().userModule.listUsersPage(viewer, {
      ...FIRST_PAGE,
      search: "nobody-matches-this",
      status: undefined,
    });

    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({ name: "Lucas S.", email: "l••••@gmail.com", image: null });
  });

  it("reads the panel summaries, gift lists and suggestions", async () => {
    const { dashboardModule, giftModule, suggestionModule } = context();

    await expect(dashboardModule.getDashboardTotals(viewer)).resolves.toBeDefined();
    await expect(dashboardModule.getOnboardingStatus(viewer)).resolves.toBeDefined();
    await expect(giftModule.listGiftCategories(viewer)).resolves.toBeDefined();
    await expect(
      giftModule.listPanelGiftsPage(viewer, { ...FIRST_PAGE, search: "", sort: "name" }),
    ).resolves.toBeDefined();
    await expect(suggestionModule.getSuggestionsPromptStatus(viewer)).resolves.toBeDefined();
  });
});
