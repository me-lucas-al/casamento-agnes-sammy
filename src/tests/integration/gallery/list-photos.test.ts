import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { createGalleryModule } from "@/modules/gallery/factory";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReadOptions, CachedReader } from "@/shared/lib/cache/cached-read";
import { photos } from "@/shared/db/schema";
import { FakeCloudinaryClient } from "@/tests/helpers/fakes/fake-cloudinary";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildGalleryContext } from "./gallery-test-context";

describe("photo listings", () => {
  const testDatabase = useTestDatabase();

  async function insertPhotos(total: number, status: "pending" | "approved" | "rejected", guestId?: string) {
    const rows = Array.from({ length: total }, (_, index) => ({
      cloudinaryPublicId: `gallery/${status}-${index}`,
      url: `https://res.cloudinary.com/demo/${status}-${index}.jpg`,
      status,
      uploadedByGuestId: guestId,
      createdAt: new Date(Date.UTC(2026, 10, 1, 0, index)),
    }));
    await testDatabase.db.insert(photos).values(rows);
  }

  const pageInput = (overrides: Partial<{ page: number; perPage: number; sort: "newest" | "oldest" }> = {}) => {
    const { page = 1, perPage = 12, sort = "newest" } = overrides;
    return { page, perPage, offset: (page - 1) * perPage, sort };
  };

  it("lists only approved photos with pagination metadata", async () => {
    await insertPhotos(13, "approved");
    await insertPhotos(4, "pending");
    await insertPhotos(2, "rejected");
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    const second = await galleryModule.listApprovedPhotosPage(asUser("guest"), pageInput({ page: 2 }));

    expect(second).toMatchObject({ total: 13, totalPages: 2, hasPreviousPage: true, hasNextPage: false });
    expect(second.items).toHaveLength(1);
  });

  it("sorts approved photos newest or oldest first", async () => {
    await insertPhotos(3, "approved");
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    const newest = await galleryModule.listApprovedPhotosPage(asUser("guest"), pageInput());
    const oldest = await galleryModule.listApprovedPhotosPage(asUser("guest"), pageInput({ sort: "oldest" }));

    expect(newest.items.map((item) => item.url).at(0)).toContain("approved-2");
    expect(oldest.items.map((item) => item.url).at(0)).toContain("approved-0");
  });

  it("requires a session to list approved photos", async () => {
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    await expect(galleryModule.listApprovedPhotosPage(null, pageInput())).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("reads approved photos through the cache with the approved tag and page keys", async () => {
    const recordedOptions: CachedReadOptions[] = [];
    const cachedReader: CachedReader = {
      read(options, load) {
        recordedOptions.push(options);
        return load();
      },
    };
    const galleryModule = createGalleryModule({
      database: testDatabase.db,
      cloudinaryClient: new FakeCloudinaryClient(),
      cachedReader,
    });

    await galleryModule.listApprovedPhotosPage(asUser("guest"), pageInput({ page: 2, perPage: 24, sort: "oldest" }));

    expect(recordedOptions[0]).toEqual({
      keyParts: ["gallery", "approved", "2", "24", "oldest"],
      tags: [approvedPhotosTag()],
    });
  });

  it("lists the panel filtered by status and paginated", async () => {
    await insertPhotos(13, "pending");
    await insertPhotos(2, "approved");
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    const pending = await galleryModule.listPhotosPanelPage(asUser("couple"), {
      page: 2,
      perPage: 12,
      offset: 12,
      status: "pending",
    });
    const everything = await galleryModule.listPhotosPanelPage(asUser("admin"), {
      page: 1,
      perPage: 12,
      offset: 0,
    });

    expect(pending).toMatchObject({ total: 13, totalPages: 2 });
    expect(pending.items).toHaveLength(1);
    expect(everything.total).toBe(15);
  });

  it("forbids guests from the panel list", async () => {
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    await expect(
      galleryModule.listPhotosPanelPage(asUser("guest"), { page: 1, perPage: 12, offset: 0 }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("counts only the guest own pending photos", async () => {
    const owner = await seedGuest(testDatabase.db);
    const other = await seedGuest(testDatabase.db);
    await insertPhotos(2, "pending", owner.id);
    await insertPhotos(1, "approved", owner.id);
    await testDatabase.db.insert(photos).values({
      cloudinaryPublicId: "gallery/other",
      url: "https://res.cloudinary.com/demo/other.jpg",
      uploadedByGuestId: other.id,
    });
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    const total = await galleryModule.countOwnPendingPhotos(asUser("guest", { guestId: owner.id }));

    expect(total).toBe(2);
  });
});
