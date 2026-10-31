import { describe, expect, it } from "vitest";
import { GiftPricingLockedError, InvalidGiftImageError, InvalidGiftProductLinkError } from "@/modules/gifts/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildGiftInput, createTestGiftModule, PAGE_ONE } from "../gift-test-module";

const productUrl = "https://www.magazineluiza.com.br/air-fryer/p/abc/";
const externalImageUrl = "https://res.cloudinary.com/demo/product.jpg";

describe("gift product link and external image", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createTestGiftModule(testDatabase.db).giftModule;
  const couple = asUser("couple");
  const guest = asUser("guest");

  it("stores the link, derives the store name and exposes them to guests with the external image", async () => {
    const giftModule = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const created = await giftModule.createGift(
      couple,
      buildGiftInput(category.id, { productUrl, externalImageUrl, priceCheckedAt: "2026-11-01" }),
    );

    const [item] = (await giftModule.listVisibleGiftsPage(guest, { ...PAGE_ONE, search: "", sort: "order" })).items;

    expect(created).toMatchObject({ productUrl, externalImageUrl, storeName: "Magazine Luiza", priceCheckedAt: "2026-11-01" });
    expect(item).toMatchObject({ imageUrl: externalImageUrl, productUrl, storeName: "Magazine Luiza" });
  });

  it("rejects disallowed stores, image hosts and both image kinds at once", async () => {
    const giftModule = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const create = (overrides: Parameters<typeof buildGiftInput>[1]) =>
      giftModule.createGift(couple, buildGiftInput(category.id, overrides));

    await expect(create({ productUrl: "https://www.shopee.com.br/x" })).rejects.toBeInstanceOf(InvalidGiftProductLinkError);
    await expect(create({ productUrl: "http://www.magazineluiza.com.br/x" })).rejects.toBeInstanceOf(InvalidGiftProductLinkError);
    await expect(create({ externalImageUrl: "https://evil.example/a.jpg" })).rejects.toBeInstanceOf(InvalidGiftProductLinkError);
    await expect(
      create({ externalImageUrl, image: { url: "https://res.cloudinary.com/x/a.jpg", publicId: "gifts/a" } }),
    ).rejects.toBeInstanceOf(InvalidGiftImageError);
  });

  it("keeps the link on update when omitted, clears it when null, and keeps the pricing lock", async () => {
    const giftModule = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const created = await giftModule.createGift(couple, buildGiftInput(category.id, { productUrl, externalImageUrl }));
    await seedContribution(testDatabase.db, { giftId: created.id, status: "confirmed" });
    const sameConfiguration = { name: created.name, priceCents: created.priceCents };

    const renamed = await giftModule.updateGift(couple, created.id, buildGiftInput(category.id, sameConfiguration));
    const cleared = await giftModule.updateGift(
      couple,
      created.id,
      buildGiftInput(category.id, { ...sameConfiguration, productUrl: null, externalImageUrl: null }),
    );

    expect(renamed).toMatchObject({ productUrl, externalImageUrl });
    expect(cleared).toMatchObject({ productUrl: null, storeName: null, externalImageUrl: null, priceCheckedAt: null });
    await expect(
      giftModule.updateGift(couple, created.id, buildGiftInput(category.id, { name: created.name, priceCents: created.priceCents + 100 })),
    ).rejects.toBeInstanceOf(GiftPricingLockedError);
  });
});
