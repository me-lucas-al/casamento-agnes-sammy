import { VIEWER_USER_ID } from "@/modules/auth/types";
import type { StaffProfile } from "../types";

export const VIEWER_STAFF_PROFILE: StaffProfile = {
  userId: VIEWER_USER_ID,
  name: "Visitante",
  email: "Modo somente leitura",
  role: "viewer",
  image: null,
};
