const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export type Countdown = {
  isOver: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function computeCountdown(target: Date, now: Date): Countdown {
  const remaining = target.getTime() - now.getTime();
  if (remaining <= 0) return { isOver: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    isOver: false,
    days: Math.floor(remaining / MS_PER_DAY),
    hours: Math.floor((remaining % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((remaining % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((remaining % MS_PER_MINUTE) / MS_PER_SECOND),
  };
}
