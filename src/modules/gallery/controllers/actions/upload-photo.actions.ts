"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import type { SignedUploadParams } from "@/shared/lib/cloudinary/cloudinary";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describePhotoError } from "@/modules/gallery/errors";
import { getGalleryModule } from "@/modules/gallery/factory";
import { registerPhotoSchema, signUploadSchema } from "@/modules/gallery/schemas/gallery.schemas";

export async function signUploadPhotoAction(input: unknown): Promise<ActionResult<SignedUploadParams>> {
  const parsed = signUploadSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describePhotoError, async () => {
    const actor = await getSessionUser();
    return success(await getGalleryModule().signUploadPhoto(actor, parsed.data));
  }, "signUploadPhotoAction");
}

export async function registerUploadedPhotoAction(
  input: unknown,
): Promise<ActionResult<{ isPending: boolean }>> {
  const parsed = registerPhotoSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describePhotoError, async () => {
    const actor = await getSessionUser();
    const { photo, changedTags } = await getGalleryModule().registerUploadedPhoto(actor, parsed.data);
    nextCacheInvalidator.invalidateTags([...changedTags, dashboardTag()]);
    nextCacheInvalidator.invalidatePath("/galeria");
    nextCacheInvalidator.invalidatePath("/painel/fotos");
    return success({ isPending: photo.status === "pending" });
  }, "registerUploadedPhotoAction");
}
