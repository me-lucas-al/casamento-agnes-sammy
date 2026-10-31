import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { findPriceBand } from "@/modules/gifts/lib/pricing/price-band";
import type { GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import { addHours } from "@/shared/lib/dates";
import { asUser } from "@/tests/helpers/fake-session";
import { seedContribution } from "@/tests/helpers/seeds/seed-contribution";
import { seedGift, seedGiftCategory } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createTestGiftModule, PAGE_ONE } from "./gift-test-module";

const baseInput: GiftListInput = { ...PAGE_ONE, search: "", sort: "order" };

describe("visible gifts listing", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createTestGiftModule(testDatabase.db).giftModule;
  const guest = asUser("guest");

  it("paginates in the backend with totals", async () => {
    const giftModule = setup();
    const category = await seedGiftCategory(testDatabase.db);
    for (let index = 0; index < 13; index += 1) {
      await seedGift(testDatabase.db, { categoryId: category.id, name: `Gift ${String(index).padStart(2, "0")}`, sortOrder: index });
    }

    const second = await giftModule.listVisibleGiftsPage(guest, { ...baseInput, page: 2, offset: 12 });

    expect(second).toMatchObject({ total: 13, totalPages: 2, hasPreviousPage: true, hasNextPage: false });
    expect(second.items.map((gift) => gift.name)).toEqual(["Gift 12"]);
  });

  it("shows only visible gifts to guests and all gifts to the panel", async () => {
    const giftModule = setup();
    await seedGift(testDatabase.db, { name: "Visible" });
    await seedGift(testDatabase.db, { name: "Hidden", isVisible: false });

    const guestPage = await giftModule.listVisibleGiftsPage(guest, baseInput);
    const panelPage = await giftModule.listPanelGiftsPage(asUser("couple"), baseInput);

    expect(guestPage.items.map((gift) => gift.name)).toEqual(["Visible"]);
    expect(panelPage.total).toBe(2);
    await expect(giftModule.listPanelGiftsPage(guest, baseInput)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("filters by search, category and price band", async () => {
    const giftModule = setup();
    const kitchen = await seedGiftCategory(testDatabase.db, { name: "Cozinha" });
    const trip = await seedGiftCategory(testDatabase.db, { name: "Viagem" });
    await seedGift(testDatabase.db, { categoryId: kitchen.id, name: "Liquidificador", priceCents: 8000 });
    await seedGift(testDatabase.db, { categoryId: kitchen.id, name: "Panela", priceCents: 25000 });
    await seedGift(testDatabase.db, { categoryId: trip.id, name: "Jantar romântico", priceCents: 45000 });
    await seedGift(testDatabase.db, { categoryId: trip.id, name: "Hospedagem", priceCents: 90000 });
    const names = async (overrides: Partial<GiftListInput>) =>
      (await giftModule.listVisibleGiftsPage(guest, { ...baseInput, sort: "name", ...overrides })).items.map(
        (gift) => gift.name,
      );

    expect(await names({ search: "panel" })).toEqual(["Panela"]);
    expect(await names({ categoryId: trip.id })).toEqual(["Hospedagem", "Jantar romântico"]);
    expect(await names({ band: findPriceBand("until-100") })).toEqual(["Liquidificador"]);
    expect(await names({ band: findPriceBand("100-300") })).toEqual(["Panela"]);
    expect(await names({ band: findPriceBand("300-600") })).toEqual(["Jantar romântico"]);
    expect(await names({ band: findPriceBand("600-plus") })).toEqual(["Hospedagem"]);
    expect(await names({ categoryId: trip.id, band: findPriceBand("600-plus") })).toEqual(["Hospedagem"]);
  });

  it("sorts by price, name and order", async () => {
    const giftModule = setup();
    await seedGift(testDatabase.db, { name: "B", priceCents: 200, sortOrder: 1 });
    await seedGift(testDatabase.db, { name: "A", priceCents: 300, sortOrder: 2 });
    await seedGift(testDatabase.db, { name: "C", priceCents: 100, sortOrder: 0 });
    const names = async (sort: GiftListInput["sort"]) =>
      (await giftModule.listVisibleGiftsPage(guest, { ...baseInput, sort })).items.map((gift) => gift.name);

    expect(await names("price-asc")).toEqual(["C", "B", "A"]);
    expect(await names("price-desc")).toEqual(["A", "B", "C"]);
    expect(await names("name")).toEqual(["A", "B", "C"]);
    expect(await names("order")).toEqual(["C", "B", "A"]);
  });

  it("computes availability live from confirmed and non-expired reserved contributions", async () => {
    const giftModule = setup();
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 5, priceCents: 50000 });
    const now = new Date();
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "confirmed", quotas: 1, amountCents: 10000 });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "reserved", quotas: 1, amountCents: 10000, expiresAt: addHours(now, 5) });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "reserved", quotas: 2, amountCents: 20000, expiresAt: addHours(now, -1) });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "cancelled", quotas: 1, amountCents: 10000 });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "expired", quotas: 1, amountCents: 10000 });

    const [item] = (await giftModule.listVisibleGiftsPage(guest, baseInput)).items;
    const direct = await giftModule.getGiftAvailability(gift.id);

    expect(item.availability).toMatchObject({ state: "partial", takenQuotas: 2, remainingQuotas: 3, remainingCents: 30000 });
    expect(direct).toEqual(item.availability);
  });

  it("reports single and free_amount gifts as complete when fully taken", async () => {
    const giftModule = setup();
    const single = await seedGift(testDatabase.db, { name: "Single", mode: "single" });
    const free = await seedGift(testDatabase.db, { name: "Free", mode: "free_amount", priceCents: 50000, minAmountCents: 1000 });
    await seedContribution(testDatabase.db, { giftId: single.id, status: "confirmed", amountCents: 30000 });
    await seedContribution(testDatabase.db, { giftId: free.id, status: "confirmed", amountCents: 50000 });

    expect((await giftModule.getGiftAvailability(single.id)).state).toBe("complete");
    expect(await giftModule.getGiftAvailability(free.id)).toMatchObject({ state: "complete", remainingCents: 0 });
  });

  it("does not leak donor information in guest items", async () => {
    const giftModule = setup();
    const gift = await seedGift(testDatabase.db);
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "confirmed" });

    const [item] = (await giftModule.listVisibleGiftsPage(guest, baseInput)).items;

    expect(Object.keys(item).some((key) => /guest|donor|contribution/i.test(key))).toBe(false);
  });
});
