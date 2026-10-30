import type { GuestProfile, StaffProfile } from "../types";

export interface ProfileRepository {
  findGuestProfile(guestId: string): Promise<GuestProfile | null>;
  findStaffProfile(userId: string): Promise<StaffProfile | null>;
}
