import type { Guest, GuestDetails, GuestListPage, GuestListQuery, NewGuest } from "@/modules/guests/types";

export type GuestDeletionOutcome = "deleted" | "not_found" | "has_confirmed";

export interface GuestRepository {
  findById(guestId: string): Promise<Guest | null>;
  codeExists(code: string): Promise<boolean>;
  create(newGuest: NewGuest): Promise<Guest>;
  update(guestId: string, details: GuestDetails): Promise<Guest | null>;
  updateCode(guestId: string, code: string): Promise<Guest | null>;
  hasConfirmedContributions(guestId: string): Promise<boolean>;
  deleteUnlessCommitted(guestId: string): Promise<GuestDeletionOutcome>;
  listPage(query: GuestListQuery): Promise<GuestListPage>;
}
