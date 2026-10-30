import { DISPLAY_TIME_ZONE } from "@/shared/lib/dates";

export type EventDateParts = {
  day: string;
  month: string;
  shortYear: string;
  weekday: string;
  time: string;
};

const numericFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: DISPLAY_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: DISPLAY_TIME_ZONE,
  weekday: "long",
});

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(hour: string, minute: string): string {
  return minute === "00" ? `${Number(hour)}h` : `${Number(hour)}h${minute}`;
}

export function getEventDateParts(date: Date): EventDateParts {
  const parts = numericFormatter.formatToParts(date);
  return {
    day: readPart(parts, "day"),
    month: readPart(parts, "month"),
    shortYear: readPart(parts, "year"),
    weekday: capitalize(weekdayFormatter.format(date).replace("-feira", "")),
    time: formatTime(readPart(parts, "hour"), readPart(parts, "minute")),
  };
}
