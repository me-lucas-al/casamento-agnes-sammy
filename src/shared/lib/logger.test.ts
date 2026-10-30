import { describe, expect, it } from "vitest";
import { createConsoleLogger } from "./logger";

describe("console logger", () => {
  function createCapturedLogger() {
    const lines: Record<string, string[]> = { info: [], warn: [], error: [] };
    const logger = createConsoleLogger({
      info: (line) => lines.info.push(line),
      warn: (line) => lines.warn.push(line),
      error: (line) => lines.error.push(line),
    });
    return { logger, lines };
  }

  it("writes one structured JSON line per level", () => {
    const { logger, lines } = createCapturedLogger();
    logger.error("boom", { route: "cron" });
    const entry = JSON.parse(lines.error[0]);
    expect(entry).toMatchObject({ level: "error", event: "boom", route: "cron" });
    expect(typeof entry.time).toBe("string");
  });

  it("routes each level to its own sink", () => {
    const { logger, lines } = createCapturedLogger();
    logger.info("a");
    logger.warn("b");
    expect([lines.info.length, lines.warn.length, lines.error.length]).toEqual([1, 1, 0]);
  });

  it("never writes sensitive context values in full", () => {
    const { logger, lines } = createCapturedLogger();
    logger.warn("login", { code: "K7M2QX9P", note: "mail ana@example.com" });
    expect(lines.warn[0]).not.toContain("K7M2QX9P");
    expect(lines.warn[0]).not.toContain("ana@example.com");
  });
});
