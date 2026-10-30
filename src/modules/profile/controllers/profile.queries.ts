import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getProfileModule } from "../factory";
import type { GuestProfile } from "../types";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function getMyGuestProfileQuery() {
  return guardedQuery("getMyGuestProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getGuestProfile(actor, actor?.guestId ?? "");
  });
}

export async function getFirstAccessProfileQuery(): Promise<GuestProfile | null> {
  try {
    const actor = await getSessionUser();
    if (actor?.role !== "guest" || !actor.guestId) return null;
    const profile = await getProfileModule().getGuestProfile(actor, actor.guestId);
    return profile.profileCompleted ? null : profile;
  } catch {
    return null;
  }
}

export async function getMyStaffProfileQuery() {
  return guardedQuery("getMyStaffProfileQuery", async () => {
    const actor = await getSessionUser();
    return getProfileModule().getStaffProfile(actor);
  });
}
