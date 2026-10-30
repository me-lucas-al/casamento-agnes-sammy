"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import type { SignedUploadParams } from "@/shared/lib/cloudinary";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describePhotoError } from "../errors";
import { getGalleryModule } from "../factory";
import { registerPhotoSchema, signUploadSchema } from "../schemas/gallery.schemas";

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
