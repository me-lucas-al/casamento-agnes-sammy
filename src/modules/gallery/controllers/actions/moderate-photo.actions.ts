"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import type { SessionUser } from "@/modules/auth/types";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describePhotoError } from "@/modules/gallery/errors";
import { getGalleryModule, type GalleryModule } from "@/modules/gallery/factory";
import { photoIdSchema } from "@/modules/gallery/schemas/gallery.schemas";

type ModerationUseCase = (
  galleryModule: GalleryModule,
) => (actor: SessionUser | null, photoId: string) => Promise<{ changedTags: string[] }>;

async function moderate(photoId: unknown, pickUseCase: ModerationUseCase): Promise<ActionResult> {
  const parsed = photoIdSchema.safeParse(photoId);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describePhotoError, async () => {
    const actor = await getSessionUser();
    const { changedTags } = await pickUseCase(getGalleryModule())(actor, parsed.data);
    nextCacheInvalidator.invalidateTags([...changedTags, dashboardTag()]);
    nextCacheInvalidator.invalidatePath("/galeria");
    nextCacheInvalidator.invalidatePath("/painel/fotos");
    return success();
  }, "moderate");
}

export async function approvePhotoAction(photoId: unknown): Promise<ActionResult> {
  return moderate(photoId, (galleryModule) => galleryModule.approvePhoto);
}

export async function rejectPhotoAction(photoId: unknown): Promise<ActionResult> {
  return moderate(photoId, (galleryModule) => galleryModule.rejectPhoto);
}

export async function deletePhotoAction(photoId: unknown): Promise<ActionResult> {
  return moderate(photoId, (galleryModule) => galleryModule.deletePhoto);
}
