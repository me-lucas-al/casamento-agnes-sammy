import type { RsvpStatus } from "../types";

const LABELS: Record<RsvpStatus, string> = {
  pending: "Aguardando sua resposta",
  going: "Presença confirmada",
  declined: "Não poderá comparecer",
};

export function describeRsvpStatus(status: RsvpStatus): string {
  return LABELS[status];
}
