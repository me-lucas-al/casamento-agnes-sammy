import type { StaffRole } from "@/modules/auth/types";

export type AllowedUser = {
  id: string;
  role: StaffRole;
};

export interface ActiveUserLookup {
  findActiveByEmail(email: string): Promise<AllowedUser | null>;
}
