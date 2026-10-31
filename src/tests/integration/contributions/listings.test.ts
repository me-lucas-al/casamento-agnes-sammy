import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { GiftNotFoundError } from "@/modules/contributions/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

const defaultQuery = { page: 1, perPage: 12, offset: 0, status: "all", search: "", sort: "newest" } as const;

describe("contribution listings", () => {
  const testDatabase = useTestDatabase();

  it("lists only the guest's own contributions", async () => {
    const { contributions } = createContributionContext(testDatabase.db);
    const mine = await seedGuestActor(testDatabase.db);
    const other = await seedGuestActor(testDatabase.db);
    const [firstGift, secondGift] = [await seedGift(testDatabase.db), await seedGift(testDatabase.db)];
    await contributions.reserveGift(mine, { giftId: firstGift.id });
    await contributions.reserveGift(other, { giftId: secondGift.id });

    const list = await contributions.listMyContributions(mine);

    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ giftId: firstGift.id, giftName: firstGift.name });
  });

  it("only allows guests to list my contributions", async () => {
    const { contributions } = createContributionContext(testDatabase.db);

    await expect(contributions.listMyContributions(asUser("couple"))).rejects.toBeInstanceOf(ForbiddenError);
  });

  async function seedPayments() {
    const context = createContributionContext(testDatabase.db);
    const ana = await seedGuestActor(testDatabase.db, "Ana Lima");
    const bruno = await seedGuestActor(testDatabase.db, "Bruno Costa");
    const panela = await seedGift(testDatabase.db, { name: "Panela", priceCents: 10000 });
    const cafeteira = await seedGift(testDatabase.db, { name: "Cafeteira", priceCents: 50000 });
    const first = await context.contributions.reserveGift(ana, { giftId: panela.id });
    context.advanceHours(1);
    await context.contributions.reserveGift(bruno, { giftId: cafeteira.id });
    await context.contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "admin"), { contributionId: first.id });
    return context;
  }

  it("filters by status and defaults of the caller", async () => {
    const { contributions } = await seedPayments();
    const couple = asUser("couple");

    const reserved = await contributions.listPendingPayments(couple, { ...defaultQuery, status: "reserved" });
    const confirmed = await contributions.listPendingPayments(couple, { ...defaultQuery, status: "confirmed" });
    const all = await contributions.listPendingPayments(couple, defaultQuery);

    expect([reserved.total, confirmed.total, all.total]).toEqual([1, 1, 2]);
    expect(reserved.items[0]).toMatchObject({ giftName: "Cafeteira", guestName: "Bruno Costa" });
  });

  it("searches by guest or gift name", async () => {
    const { contributions } = await seedPayments();
    const couple = asUser("couple");

    const byGuest = await contributions.listPendingPayments(couple, { ...defaultQuery, search: "ana" });
    const byGift = await contributions.listPendingPayments(couple, { ...defaultQuery, search: "cafet" });

    expect(byGuest.items.map((item) => item.guestName)).toEqual(["Ana Lima"]);
    expect(byGift.items.map((item) => item.giftName)).toEqual(["Cafeteira"]);
  });

  it("sorts by newest, oldest and amount", async () => {
    const { contributions } = await seedPayments();
    const couple = asUser("couple");
    const names = async (sort: "newest" | "oldest" | "amount") =>
      (await contributions.listPendingPayments(couple, { ...defaultQuery, sort })).items.map(
        (item) => item.giftName,
      );

    expect(await names("newest")).toEqual(["Cafeteira", "Panela"]);
    expect(await names("oldest")).toEqual(["Panela", "Cafeteira"]);
    expect(await names("amount")).toEqual(["Cafeteira", "Panela"]);
  });

  it("paginates in the backend with total count", async () => {
    const { contributions } = createContributionContext(testDatabase.db);
    for (let index = 0; index < 13; index += 1) {
      const guest = await seedGuestActor(testDatabase.db);
      const gift = await seedGift(testDatabase.db);
      await contributions.reserveGift(guest, { giftId: gift.id });
    }

    const secondPage = await contributions.listPendingPayments(asUser("admin"), {
      ...defaultQuery,
      page: 2,
      offset: 12,
    });

    expect(secondPage).toMatchObject({ total: 13, totalPages: 2, hasNextPage: false });
    expect(secondPage.items).toHaveLength(1);
  });

  it.each(["guest", "none"] as const)("forbids listing payments as %s", async (kind) => {
    const { contributions } = createContributionContext(testDatabase.db);
    const guest = await seedGuest(testDatabase.db);
    const actor = kind === "guest" ? asUser("guest", { guestId: guest.id }) : null;

    await expect(contributions.listPendingPayments(actor, defaultQuery)).rejects.toThrow();
  });

  it("exposes availability without donor names and hides invisible gifts from guests", async () => {
    const { contributions } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 4 });
    const hidden = await seedGift(testDatabase.db, { isVisible: false });
    const guest = await seedGuestActor(testDatabase.db);
    await contributions.reserveGift(guest, { giftId: gift.id, quotas: 3 });

    const view = await contributions.getGiftAvailability(guest, gift.id);

    expect(view.availability).toMatchObject({ remainingQuotas: 1, committedQuotas: 3 });
    expect(JSON.stringify(view)).not.toContain(guest.guestId);
    await expect(contributions.getGiftAvailability(guest, hidden.id)).rejects.toBeInstanceOf(GiftNotFoundError);
    await expect(contributions.getGiftAvailability(asUser("couple"), hidden.id)).resolves.toBeDefined();
  });
});
