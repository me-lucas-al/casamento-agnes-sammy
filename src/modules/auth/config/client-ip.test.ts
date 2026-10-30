import { describe, expect, it } from "vitest";
import { readClientIp } from "./client-ip";

describe("readClientIp", () => {
  it("uses the first forwarded address", () => {
    expect(readClientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
  });

  it("falls back to x-real-ip", () => {
    expect(readClientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
  });

  it("derives a stable fingerprint without ip headers", () => {
    const traits = { "user-agent": "Agent A", "accept-language": "pt-BR" };
    const first = readClientIp(new Headers(traits));
    expect(first).toBe(readClientIp(new Headers(traits)));
    expect(first).toMatch(/^unknown:[0-9a-f]{16}$/);
  });

  it("separates different clients without ip headers", () => {
    const first = readClientIp(new Headers({ "user-agent": "Agent A" }));
    const second = readClientIp(new Headers({ "user-agent": "Agent B" }));
    expect(first).not.toBe(second);
  });
});
