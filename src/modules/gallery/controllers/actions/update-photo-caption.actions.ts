"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describePhotoError } from "@/modules/gallery/errors";
import { getGalleryModule } from "@/modules/gallery/factory";
import { updateCaptionSchema } from "@/modules/gallery/schemas/gallery.schemas";

export async function updatePhotoCaptionAction(input: unknown): Promise<ActionResult> {
  const parsed = updateCaptionSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describePhotoError, async () => {
    const actor = await getSessionUser();
    const { photoId, caption } = parsed.data;
    const { changedTags } = await getGalleryModule().updatePhotoCaption(actor, photoId, caption);
    nextCacheInvalidator.invalidateTags(changedTags);
    nextCacheInvalidator.invalidatePath("/galeria");
    nextCacheInvalidator.invalidatePath("/painel/fotos");
    return success();
  }, "updatePhotoCaptionAction");
}
