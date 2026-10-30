import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, type SearchParams } from "@/shared/lib/url-params";
import { getGalleryModule } from "../factory";
import { PHOTO_SORTS, PHOTO_STATUSES } from "../types";

export async function listApprovedPhotosQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  const sort = enumParam(searchParams, "sort", PHOTO_SORTS) ?? "newest";
  return getGalleryModule().listApprovedPhotosPage(actor, { ...parsePageParams(searchParams), sort });
}

export async function listPhotosPanelQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  const status = enumParam(searchParams, "status", PHOTO_STATUSES);
  return getGalleryModule().listPhotosPanelPage(actor, { ...parsePageParams(searchParams), status });
}

export async function countOwnPendingPhotosQuery(): Promise<number> {
  const actor = await getSessionUser();
  if (actor?.role !== "guest") return 0;
  return getGalleryModule().countOwnPendingPhotos(actor);
}
