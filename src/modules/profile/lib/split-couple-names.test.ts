import { describe, expect, it } from "vitest";
import { splitCoupleNames } from "./split-couple-names";

describe("splitCoupleNames", () => {
  it("splits on the ampersand", () => {
    expect(splitCoupleNames("Agnes & Sammy")).toEqual(["Agnes", "Sammy"]);
  });

  it("keeps a single name in the first slot", () => {
    expect(splitCoupleNames("Agnes")).toEqual(["Agnes", ""]);
  });
});
