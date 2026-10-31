import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination/pagination";
import { enumParam, type SearchParams } from "@/shared/lib/url/url-params";
import { getGalleryModule } from "@/modules/gallery/factory";
import { PHOTO_SORTS, PHOTO_STATUSES } from "@/modules/gallery/types";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";

export async function listApprovedPhotosQuery(searchParams: SearchParams) {
  return guardedQuery("listApprovedPhotosQuery", async () => {
    const actor = await getSessionUser();
    const sort = enumParam(searchParams, "sort", PHOTO_SORTS) ?? "newest";
    return getGalleryModule().listApprovedPhotosPage(actor, { ...parsePageParams(searchParams), sort });
  });
}

export async function listPhotosPanelQuery(searchParams: SearchParams) {
  return guardedQuery("listPhotosPanelQuery", async () => {
    const actor = await getSessionUser();
    const status = enumParam(searchParams, "status", PHOTO_STATUSES);
    return getGalleryModule().listPhotosPanelPage(actor, { ...parsePageParams(searchParams), status });
  });
}

export async function countOwnPendingPhotosQuery(): Promise<number> {
  return guardedQuery("countOwnPendingPhotosQuery", async () => {
    const actor = await getSessionUser();
    if (actor?.role !== "guest") return 0;
    return getGalleryModule().countOwnPendingPhotos(actor);
  });
}
