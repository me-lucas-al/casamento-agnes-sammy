import { describe, expect, it } from "vitest";
import { parsePaymentsFilters } from "./payments-filters.schema";

describe("parsePaymentsFilters", () => {
  it("falls back to defaults for missing or invalid params", () => {
    expect(parsePaymentsFilters({ status: "bogus", sort: "nope" })).toEqual({
      status: "reserved",
      search: "",
      sort: "newest",
    });
  });

  it("reads valid params", () => {
    expect(parsePaymentsFilters({ status: "all", search: " ana ", sort: "amount" })).toEqual({
      status: "all",
      search: "ana",
      sort: "amount",
    });
  });
});
