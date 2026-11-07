import type { StaffRole } from "@/modules/auth/types";

export interface SessionAccountLookup {
  findActiveStaffRole(userId: string): Promise<StaffRole | null>;
  guestExists(guestId: string): Promise<boolean>;
}
