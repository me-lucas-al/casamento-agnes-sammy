"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import type { SessionUser } from "@/modules/auth/types";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describePhotoError } from "../errors";
import { getGalleryModule, type GalleryModule } from "../factory";
import { photoIdSchema } from "../schemas/gallery.schemas";

type ModerationUseCase = (
  galleryModule: GalleryModule,
) => (actor: SessionUser | null, photoId: string) => Promise<{ changedTags: string[] }>;

async function moderate(photoId: unknown, pickUseCase: ModerationUseCase): Promise<ActionResult> {
  const parsed = photoIdSchema.safeParse(photoId);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    const { changedTags } = await pickUseCase(getGalleryModule())(actor, parsed.data);
    nextCacheInvalidator.invalidateTags(changedTags);
    nextCacheInvalidator.invalidatePath("/galeria");
    nextCacheInvalidator.invalidatePath("/painel/fotos");
    return success();
  } catch (error) {
    return failure(describePhotoError(error));
  }
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
