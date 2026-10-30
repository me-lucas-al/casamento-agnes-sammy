import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, type SearchParams } from "@/shared/lib/url-params";
import { getMessageModule } from "../factory";
import { MODERATION_STATUSES } from "../types";

export async function listApprovedMessagesQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  return getMessageModule().listApprovedMessagesPage(actor, parsePageParams(searchParams));
}

export async function listMessagesForModerationQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  return getMessageModule().listMessagesPage(actor, {
    ...parsePageParams(searchParams),
    status: enumParam(searchParams, "status", MODERATION_STATUSES),
  });
}
