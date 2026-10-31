import { describe, expect, it } from "vitest";
import { buildInvitationLink } from "../invitation-link";

describe("buildInvitationLink", () => {
  it("builds the login link carrying the code", () => {
    expect(buildInvitationLink("https://site.com", "ABC23XYZ")).toBe("https://site.com/?codigo=ABC23XYZ");
  });

  it("drops trailing slashes and encodes the code", () => {
    expect(buildInvitationLink("https://site.com//", "A B")).toBe("https://site.com/?codigo=A%20B");
  });
});
