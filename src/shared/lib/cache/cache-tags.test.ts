import { describe, expect, it } from "vitest";
import {
  approvedMessagesTag,
  approvedPhotosTag,
  categoriesTag,
  contributionsTag,
  eventTag,
  giftsTag,
  giftTag,
  guestTag,
  pendingPaymentsTag,
  dashboardTag,
} from "./cache-tags";

describe("cache tags", () => {
  it("gives stable names to global tags", () => {
    expect([
      eventTag(),
      giftsTag(),
      categoriesTag(),
      approvedMessagesTag(),
      approvedPhotosTag(),
      pendingPaymentsTag(),
      dashboardTag(),
    ]).toEqual([
      "event",
      "gifts",
      "gift-categories",
      "messages:approved",
      "photos:approved",
      "payments:pending",
      "dashboard",
    ]);
  });

  it("scopes entity tags by id", () => {
    expect(giftTag("g1")).toBe("gift:g1");
    expect(guestTag("u1")).toBe("guest:u1");
    expect(contributionsTag("u1")).toBe("contributions:u1");
  });

  it("keeps entity tags distinct", () => {
    expect(giftTag("1")).not.toBe(guestTag("1"));
    expect(guestTag("1")).not.toBe(contributionsTag("1"));
  });
});
