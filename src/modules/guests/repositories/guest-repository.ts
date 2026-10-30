import type { Guest, GuestDetails, GuestListPage, GuestListQuery, NewGuest } from "../types";

export interface GuestRepository {
  findById(guestId: string): Promise<Guest | null>;
  codeExists(code: string): Promise<boolean>;
  create(newGuest: NewGuest): Promise<Guest>;
  update(guestId: string, details: GuestDetails): Promise<Guest | null>;
  updateCode(guestId: string, code: string): Promise<Guest | null>;
  hasConfirmedContributions(guestId: string): Promise<boolean>;
  delete(guestId: string): Promise<void>;
  listPage(query: GuestListQuery): Promise<GuestListPage>;
}
