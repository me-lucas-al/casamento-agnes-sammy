import { describe, expect, it } from "vitest";
import { guestIdSchema, submitRsvpForGuestSchema } from "../submit-rsvp.schema";

describe("guest id validation", () => {
  it("rejects empty and malformed ids", () => {
    expect(guestIdSchema.safeParse("").success).toBe(false);
    expect(guestIdSchema.safeParse("not-a-uuid").success).toBe(false);
    expect(submitRsvpForGuestSchema.safeParse({ guestId: "", status: "going" }).success).toBe(false);
  });

  it("accepts a uuid", () => {
    expect(guestIdSchema.safeParse(crypto.randomUUID()).success).toBe(true);
  });
});
