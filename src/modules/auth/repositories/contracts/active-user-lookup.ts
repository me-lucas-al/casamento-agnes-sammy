import type { Role } from "@/modules/auth/types";

export type AllowedUser = {
  id: string;
  role: Exclude<Role, "guest">;
};

export interface ActiveUserLookup {
  findActiveByEmail(email: string): Promise<AllowedUser | null>;
}
