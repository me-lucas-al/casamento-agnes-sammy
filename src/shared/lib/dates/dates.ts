export const DISPLAY_TIME_ZONE = "America/Sao_Paulo";

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: DISPLAY_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: DISPLAY_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateInSaoPaulo(date: Date): string {
  return dateFormatter.format(date);
}

export function formatDateTimeInSaoPaulo(date: Date): string {
  return dateTimeFormatter.format(date);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * MILLISECONDS_PER_HOUR);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isExpired(expiresAt: Date, now: Date): boolean {
  return expiresAt.getTime() <= now.getTime();
}

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: DISPLAY_TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatLongDateInSaoPaulo(date: Date): string {
  return longDateFormatter.format(date);
}
