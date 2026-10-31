import { describe, expect, it } from "vitest";
import { buildGuestInviteUrl, buildWhatsappShareLink, normalizeWhatsappNumber } from "../whatsapp-link";

const baseUrl = "https://agnesesammy.com.br/";

describe("whatsapp link builder", () => {
  it("builds the invite url without duplicated slashes", () => {
    expect(buildGuestInviteUrl(baseUrl, "K7M2QX9P")).toBe(
      "https://agnesesammy.com.br/?codigo=K7M2QX9P",
    );
  });

  it("prefixes brazilian numbers and strips formatting", () => {
    expect(normalizeWhatsappNumber("(11) 91234-5678")).toBe("5511912345678");
    expect(normalizeWhatsappNumber("+55 11 91234-5678")).toBe("5511912345678");
    expect(normalizeWhatsappNumber(null)).toBe("");
  });

  it("builds a wa.me link carrying the invite url in the message", () => {
    const link = buildWhatsappShareLink({
      baseUrl,
      guestName: "Maria",
      code: "K7M2QX9P",
      phone: "11912345678",
    });
    const url = new URL(link);

    expect(url.origin + url.pathname).toBe("https://wa.me/5511912345678");
    expect(url.searchParams.get("text")).toContain("/?codigo=K7M2QX9P");
    expect(url.searchParams.get("text")).toContain("Maria");
  });

  it("builds a contact-less link when the phone is missing", () => {
    const link = buildWhatsappShareLink({ baseUrl, guestName: "Maria", code: "K7M2QX9P" });

    expect(link.startsWith("https://wa.me/?text=")).toBe(true);
  });
});
