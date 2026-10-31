import { describe, expect, it } from "vitest";
import { invalidateGiftCaches } from "@/modules/gifts/lib/caches/invalidate-gift-caches";
import type { GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { InMemoryTaggedCache } from "../in-memory-tagged-cache";
import { buildGiftInput, createTestGiftModule, PAGE_ONE } from "../gift-test-module";

const baseInput: GiftListInput = { ...PAGE_ONE, search: "", sort: "order" };

describe("gift cache", () => {
  const testDatabase = useTestDatabase();
  const guest = asUser("guest");

  it("keys the cache by every list param and tags it with gifts and categories", async () => {
    const cache = new InMemoryTaggedCache();
    const { giftModule } = createTestGiftModule(testDatabase.db, { cachedReader: cache });

    await giftModule.listVisibleGiftsPage(guest, { ...baseInput, search: "x", sort: "name" });
    await giftModule.listVisibleGiftsPage(guest, baseInput);

    expect(cache.loadCount).toBe(2);
    expect(cache.readKeys[0]).toEqual(expect.arrayContaining(["search:x", "sort:name", "page:1", "perPage:12"]));
    expect(cache.readTags[0]).toEqual(["gifts", "gift-categories"]);
  });

  it("serves stale data until the tags are invalidated, then reflects the mutation", async () => {
    const cache = new InMemoryTaggedCache();
    const { giftModule } = createTestGiftModule(testDatabase.db, { cachedReader: cache });
    const admin = asUser("admin");
    const gift = await seedGift(testDatabase.db, { name: "Original" });

    await giftModule.listVisibleGiftsPage(guest, baseInput);
    await giftModule.updateGift(admin, gift.id, buildGiftInput(gift.categoryId, { name: "Renamed" }));
    const stale = await giftModule.listVisibleGiftsPage(guest, baseInput);
    invalidateGiftCaches(cache, gift.id);
    const fresh = await giftModule.listVisibleGiftsPage(guest, baseInput);

    expect(stale.items[0].name).toBe("Original");
    expect(fresh.items[0].name).toBe("Renamed");
  });

  it("keeps availability live even while the page is cached", async () => {
    const cache = new InMemoryTaggedCache();
    const { giftModule } = createTestGiftModule(testDatabase.db, { cachedReader: cache });
    const gift = await seedGift(testDatabase.db, { mode: "single" });

    const before = await giftModule.listVisibleGiftsPage(guest, baseInput);
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "reserved" });
    const after = await giftModule.listVisibleGiftsPage(guest, baseInput);

    expect(cache.loadCount).toBe(1);
    expect(before.items[0].availability.state).toBe("available");
    expect(after.items[0].availability.state).toBe("complete");
  });

  it("invalidates gifts, categories and the specific gift tag plus both paths", () => {
    const invalidator = new FakeCacheInvalidator();

    invalidateGiftCaches(invalidator, "abc");

    expect(invalidator.invalidatedTags).toEqual(["gifts", "gift-categories", "gift:abc"]);
    expect(invalidator.invalidatedPaths).toEqual(["/painel/presentes", "/presentes"]);
  });

  it("omits the gift tag for category changes", () => {
    const invalidator = new FakeCacheInvalidator();

    invalidateGiftCaches(invalidator);

    expect(invalidator.invalidatedTags).toEqual(["gifts", "gift-categories"]);
  });
});
