import { maskEmail } from "@/shared/lib/privacy/mask-contact";
import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { User } from "../../types";

export function maskUserForViewer(user: User): User {
  return { ...user, name: maskPersonName(user.name), email: maskEmail(user.email), image: null };
}
