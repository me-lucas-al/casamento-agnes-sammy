import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import type { SearchParams } from "@/shared/lib/url-params";
import { getGiftModule } from "../factory";
import { parseGiftListParams } from "../schemas/gift-list-params";

export async function listVisibleGiftsPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  return getGiftModule().listVisibleGiftsPage(actor, parseGiftListParams(searchParams));
}

export async function listPanelGiftsPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  return getGiftModule().listPanelGiftsPage(actor, parseGiftListParams(searchParams));
}

export async function listGiftCategoriesQuery() {
  const actor = await getSessionUser();
  return getGiftModule().listGiftCategories(actor);
}

export async function getGiftForEditQuery(giftId: string) {
  const actor = await getSessionUser();
  return getGiftModule().getGiftForEdit(actor, giftId);
}
