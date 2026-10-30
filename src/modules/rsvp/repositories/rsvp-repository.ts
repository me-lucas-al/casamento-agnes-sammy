import type {
  GuestRsvp,
  RsvpListPage,
  RsvpListQuery,
  RsvpSubmission,
  RsvpTotals,
} from "../types";

export interface RsvpRepository {
  findGuestRsvp(guestId: string): Promise<GuestRsvp | null>;
  findDeadline(): Promise<Date | null>;
  save(submission: RsvpSubmission): Promise<void>;
  listPage(query: RsvpListQuery): Promise<RsvpListPage>;
  calculateTotals(): Promise<RsvpTotals>;
}
