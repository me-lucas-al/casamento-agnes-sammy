import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { getRsvpModule } from "../factory";
import { requireGuestId } from "../lib/require-guest-id";
import { RSVP_STATUSES } from "../types";

export async function getMyRsvpQuery() {
  const actor = await getSessionUser();
  return getRsvpModule().getGuestRsvp(actor, requireGuestId(actor));
}

export async function getRsvpTotalsQuery() {
  const actor = await getSessionUser();
  return getRsvpModule().getRsvpTotals(actor);
}

export async function listRsvpsPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  return getRsvpModule().listRsvpsPage(actor, {
    ...parsePageParams(searchParams),
    status: enumParam(searchParams, "status", RSVP_STATUSES),
    search: textParam(searchParams, "search"),
  });
}
