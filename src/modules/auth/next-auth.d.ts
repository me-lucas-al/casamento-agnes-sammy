import type { DefaultSession } from "next-auth";
import type { Role } from "./types";

declare module "next-auth" {
  interface User {
    role?: Role;
    guestId?: string;
  }

  interface Session {
    user: { id: string; role: Role; guestId?: string } & DefaultSession["user"];
  }
}
