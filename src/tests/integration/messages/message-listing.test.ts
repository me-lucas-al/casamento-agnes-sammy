import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { createMessageModule } from "@/modules/messages/factory";
import { invalidateApprovedMessagesCache } from "@/modules/messages/lib/invalidate-messages-cache";
import { approvedMessagesTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReadOptions, CachedReader } from "@/shared/lib/cache/cached-read";
import { asUser } from "@/tests/helpers/fake-session";
import { FakeCacheInvalidator } from "@/tests/helpers/fake-cache-invalidator";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

class RecordingCachedReader implements CachedReader {
  readOptions: CachedReadOptions[] = [];

  read<Result>(options: CachedReadOptions, load: () => Promise<Result>): Promise<Result> {
    this.readOptions.push(options);
    return load();
  }
}

describe("message listing", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");
  const pageInput = { page: 1, perPage: 12, offset: 0 };

  async function seedMessages(total: number, approvedCount: number) {
    const guest = await seedGuest(testDatabase.db);
    const messageModule = createMessageModule(testDatabase.db);
    const session = asUser("guest", { guestId: guest.id });
    for (let index = 0; index < total; index += 1) {
      const message = await messageModule.messageRepository.create({
        guestId: session.guestId ?? "",
        authorName: "Ana",
        body: `recado ${index}`,
      });
      if (index < approvedCount) await messageModule.messageRepository.updateStatus(message.id, "approved");
    }
  }

  it("filters the moderation list by status and paginates", async () => {
    await seedMessages(15, 13);
    const messageModule = createMessageModule(testDatabase.db);

    const pending = await messageModule.listMessagesPage(couple, { ...pageInput, status: "pending" });
    const secondApprovedPage = await messageModule.listMessagesPage(couple, {
      page: 2,
      perPage: 12,
      offset: 12,
      status: "approved",
    });
    const all = await messageModule.listMessagesPage(couple, { ...pageInput, status: undefined });

    expect(pending.total).toBe(2);
    expect(secondApprovedPage).toMatchObject({ total: 13, hasNextPage: false, hasPreviousPage: true });
    expect(secondApprovedPage.items).toHaveLength(1);
    expect(all.total).toBe(15);
  });

  it("forbids guests from the moderation list", async () => {
    const messageModule = createMessageModule(testDatabase.db);

    await expect(
      messageModule.listMessagesPage(asUser("guest"), { ...pageInput, status: undefined }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("paginates the approved list through the cached reader with the approved tag", async () => {
    await seedMessages(13, 13);
    const reader = new RecordingCachedReader();
    const messageModule = createMessageModule(testDatabase.db, { cachedReader: reader });

    const secondPage = await messageModule.listApprovedMessagesPage(asUser("guest"), {
      page: 2,
      perPage: 12,
      offset: 12,
    });

    expect(secondPage.items).toHaveLength(1);
    expect(typeof secondPage.items[0]?.createdAt).toBe("string");
    expect(reader.readOptions[0]).toMatchObject({
      tags: [approvedMessagesTag()],
      keyParts: ["messages", "approved", "2", "12"],
    });
  });

  it("invalidates the approved messages tag on moderation changes", () => {
    const invalidator = new FakeCacheInvalidator();

    invalidateApprovedMessagesCache(invalidator);

    expect(invalidator.invalidatedTags).toEqual([approvedMessagesTag()]);
    expect(invalidator.invalidatedPaths).toEqual(["/recados", "/painel/recados"]);
  });
});
