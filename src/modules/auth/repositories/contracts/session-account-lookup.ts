import type { Role } from "@/modules/auth/types";

export interface SessionAccountLookup {
  findActiveStaffRole(userId: string): Promise<Exclude<Role, "guest"> | null>;
  guestExists(guestId: string): Promise<boolean>;
}
