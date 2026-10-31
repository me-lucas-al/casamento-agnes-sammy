import { describe, expect, it } from "vitest";
import { invalidateRsvpCache } from "@/modules/rsvp/lib/invalidate-rsvp-cache";
import { dashboardTag, guestTag } from "@/shared/lib/cache/cache-tags";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";

describe("rsvp cache invalidation", () => {
  it("invalidates only the guest tag and the rsvp pages", () => {
    const invalidator = new FakeCacheInvalidator();

    invalidateRsvpCache(invalidator, "guest-1");

    expect(invalidator.invalidatedTags).toEqual([guestTag("guest-1"), dashboardTag()]);
    expect(invalidator.invalidatedPaths).toEqual(["/confirmar-presenca", "/painel"]);
  });
});
