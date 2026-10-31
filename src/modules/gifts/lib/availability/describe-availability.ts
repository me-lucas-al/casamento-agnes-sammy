import type { GiftAvailability } from "./gift-availability";

function describePartial(availability: GiftAvailability): string {
  if (availability.totalQuotas !== null) {
    return `${availability.takenQuotas} de ${availability.totalQuotas} cotas`;
  }
  const total = availability.takenCents + availability.remainingCents;
  const percent = Math.floor((availability.takenCents / total) * 100);
  return `${percent}% arrecadado`;
}

export function describeAvailability(availability: GiftAvailability): string {
  if (availability.state === "complete") return "completo";
  if (availability.state === "available") return "disponível";
  return describePartial(availability);
}
