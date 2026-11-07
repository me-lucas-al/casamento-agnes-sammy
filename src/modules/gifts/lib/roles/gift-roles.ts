import { GUEST_AREA_READER_ROLES, PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { Role } from "@/modules/auth/types";

export const GIFT_MANAGER_ROLES: readonly Role[] = ["admin", "couple"];

export const GIFT_VIEWER_ROLES: readonly Role[] = GUEST_AREA_READER_ROLES;

export const GIFT_PANEL_READER_ROLES: readonly Role[] = PANEL_READER_ROLES;
