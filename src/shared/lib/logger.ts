import { redactContext, type LogContext } from "./logging/redact";

export type { LogContext } from "./logging/redact";

export type LogLevel = "info" | "warn" | "error";

export interface Logger {
  info(event: string, context?: LogContext): void;
  warn(event: string, context?: LogContext): void;
  error(event: string, context?: LogContext): void;
}

type LogSink = (line: string) => void;

const CONSOLE_SINKS: Record<LogLevel, LogSink> = {
  info: (line) => console.info(line),
  warn: (line) => console.warn(line),
  error: (line) => console.error(line),
};

export function createConsoleLogger(sinks: Record<LogLevel, LogSink> = CONSOLE_SINKS): Logger {
  function write(level: LogLevel, event: string, context: LogContext = {}) {
    const entry = { level, event, time: new Date().toISOString(), ...redactContext(context) };
    sinks[level](JSON.stringify(entry));
  }
  return {
    info: (event, context) => write("info", event, context),
    warn: (event, context) => write("warn", event, context),
    error: (event, context) => write("error", event, context),
  };
}

export const logger: Logger = createConsoleLogger();
