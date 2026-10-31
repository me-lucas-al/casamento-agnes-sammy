import { DISPLAY_TIME_ZONE } from "@/shared/lib/dates/dates";

const SAO_PAULO_UTC_OFFSET = "-03:00";
const LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const partsFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: DISPLAY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function parseSaoPauloLocalDateTime(value: string): Date | null {
  if (!LOCAL_PATTERN.test(value)) return null;
  const date = new Date(`${value}:00${SAO_PAULO_UTC_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatSaoPauloLocalDateTime(date: Date): string {
  return partsFormatter.format(date).replace(" ", "T");
}
