import type { Role } from "@/modules/auth/types";

export const GIFT_MANAGER_ROLES: readonly Role[] = ["admin", "couple"];

export const GIFT_VIEWER_ROLES: readonly Role[] = ["admin", "couple", "guest"];
