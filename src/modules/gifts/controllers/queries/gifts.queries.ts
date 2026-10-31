import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { getGiftModule } from "@/modules/gifts/factory";
import { parseGiftListParams } from "@/modules/gifts/schemas/gift-list-params";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";

export async function listVisibleGiftsPageQuery(searchParams: SearchParams) {
  return guardedQuery("listVisibleGiftsPageQuery", async () => {
    const actor = await getSessionUser();
    return getGiftModule().listVisibleGiftsPage(actor, parseGiftListParams(searchParams));
  });
}

export async function listPanelGiftsPageQuery(searchParams: SearchParams) {
  return guardedQuery("listPanelGiftsPageQuery", async () => {
    const actor = await getSessionUser();
    return getGiftModule().listPanelGiftsPage(actor, parseGiftListParams(searchParams));
  });
}

export async function listGiftCategoriesQuery() {
  return guardedQuery("listGiftCategoriesQuery", async () => {
    const actor = await getSessionUser();
    return getGiftModule().listGiftCategories(actor);
  });
}

export async function getGiftForEditQuery(giftId: string) {
  return guardedQuery("getGiftForEditQuery", async () => {
    const actor = await getSessionUser();
    return getGiftModule().getGiftForEdit(actor, giftId);
  });
}
