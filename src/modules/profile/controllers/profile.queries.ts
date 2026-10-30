import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getProfileModule } from "../factory";

export async function getMyGuestProfileQuery() {
  const actor = await getSessionUser();
  return getProfileModule().getGuestProfile(actor, actor?.guestId ?? "");
}

export async function getMyStaffProfileQuery() {
  const actor = await getSessionUser();
  return getProfileModule().getStaffProfile(actor);
}
