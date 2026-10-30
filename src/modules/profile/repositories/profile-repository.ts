import type { GuestProfile, OwnProfileSave, StaffProfile } from "../types";

export interface ProfileRepository {
  findGuestProfile(guestId: string): Promise<GuestProfile | null>;
  findRsvpDeadline(): Promise<Date | null>;
  saveOwnProfile(changes: OwnProfileSave): Promise<void>;
  findStaffProfile(userId: string): Promise<StaffProfile | null>;
}
