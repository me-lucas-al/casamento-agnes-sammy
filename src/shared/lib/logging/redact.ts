const SENSITIVE_KEY_PATTERN = /code|email|token|secret|password|phone|pix|authorization|cookie|key/i;
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const DATABASE_KEY_VALUE_PATTERN = /\(([^()]*)\)=\(([^()]*)\)/g;
const VISIBLE_PREFIX_LENGTH = 2;
const MINIMUM_MASKABLE_LENGTH = 6;

export type LogContext = Record<string, unknown>;

export function maskSensitiveValue(value: unknown): string {
  const text = String(value);
  if (text.length < MINIMUM_MASKABLE_LENGTH) return "***";
  return `${text.slice(0, VISIBLE_PREFIX_LENGTH)}***`;
}

export function scrubSensitiveText(text: string): string {
  return text
    .replace(DATABASE_KEY_VALUE_PATTERN, (_match, column: string, value: string) => {
      return `(${column})=(${maskSensitiveValue(value)})`;
    })
    .replace(EMAIL_PATTERN, (email) => maskSensitiveValue(email));
}

export function redactContext(context: LogContext): LogContext {
  const redacted: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      redacted[key] = maskSensitiveValue(value);
      continue;
    }
    redacted[key] = typeof value === "string" ? scrubSensitiveText(value) : value;
  }
  return redacted;
}
