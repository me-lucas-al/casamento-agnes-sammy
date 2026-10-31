import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, type SearchParams } from "@/shared/lib/url-params";
import { getMessageModule } from "@/modules/messages/factory";
import { MODERATION_STATUSES } from "@/modules/messages/types";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function listApprovedMessagesQuery(searchParams: SearchParams) {
  return guardedQuery("listApprovedMessagesQuery", async () => {
    const actor = await getSessionUser();
    return getMessageModule().listApprovedMessagesPage(actor, parsePageParams(searchParams));
  });
}

export async function listMessagesForModerationQuery(searchParams: SearchParams) {
  return guardedQuery("listMessagesForModerationQuery", async () => {
    const actor = await getSessionUser();
    return getMessageModule().listMessagesPage(actor, {
      ...parsePageParams(searchParams),
      status: enumParam(searchParams, "status", MODERATION_STATUSES),
    });
  });
}
