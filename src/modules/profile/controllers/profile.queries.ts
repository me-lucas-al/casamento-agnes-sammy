import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getProfileModule } from "../factory";
import type { GuestProfile } from "../types";
import { guardedQuery } from "@/shared/lib/guarded-query";
import { withLoggedFallback } from "@/shared/lib/logged-fallback";

export async function getMyGuestProfileQuery() {
  return guardedQuery("getMyGuestProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getGuestProfile(actor, actor?.guestId ?? "");
  });
}

export async function getFirstAccessProfileQuery(): Promise<GuestProfile | null> {
  return withLoggedFallback("query.first_access_profile_fallback", null, async () => {
    const actor = await getSessionUser();
    if (actor?.role !== "guest" || !actor.guestId) return null;
    const profile = await getProfileModule().getGuestProfile(actor, actor.guestId);
    return profile.profileCompleted ? null : profile;
  });
}

export async function getMyStaffProfileQuery() {
  return guardedQuery("getMyStaffProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getStaffProfile(actor);
  });
}
