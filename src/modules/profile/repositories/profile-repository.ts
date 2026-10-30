import type { GuestProfile, OwnProfileSave, StaffProfile } from "../types";

export interface ProfileRepository {
  findGuestProfile(guestId: string): Promise<GuestProfile | null>;
  saveOwnProfile(changes: OwnProfileSave): Promise<void>;
  findStaffProfile(userId: string): Promise<StaffProfile | null>;
}
