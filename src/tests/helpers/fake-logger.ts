import type { LogContext, Logger } from "@/shared/lib/logger";

export type LoggedEntry = { level: "info" | "warn" | "error"; event: string; context: LogContext };

export class FakeLogger implements Logger {
  entries: LoggedEntry[] = [];

  info(event: string, context: LogContext = {}) {
    this.entries.push({ level: "info", event, context });
  }

  warn(event: string, context: LogContext = {}) {
    this.entries.push({ level: "warn", event, context });
  }

  error(event: string, context: LogContext = {}) {
    this.entries.push({ level: "error", event, context });
  }

  errors(): LoggedEntry[] {
    return this.entries.filter((entry) => entry.level === "error");
  }
}
