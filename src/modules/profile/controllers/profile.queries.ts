import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getProfileModule } from "../factory";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function getMyGuestProfileQuery() {
  return guardedQuery("getMyGuestProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getGuestProfile(actor, actor?.guestId ?? "");
  });
}

export async function getMyStaffProfileQuery() {
  return guardedQuery("getMyStaffProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getStaffProfile(actor);
  });
}
