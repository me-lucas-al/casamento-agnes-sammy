const ACTIVE_STATUSES: readonly string[] = ["reserved", "confirmed"];

export function countActiveContributions(contributions: readonly { status: string }[]): number {
  return contributions.filter((contribution) => ACTIVE_STATUSES.includes(contribution.status)).length;
}
