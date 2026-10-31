"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import type { SignedUploadParams } from "@/shared/lib/cloudinary/cloudinary";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describeGiftError } from "@/modules/gifts/errors";
import { getGiftModule } from "@/modules/gifts/factory";
import { giftImageUploadSchema } from "@/modules/gifts/schemas/gift-image-upload.schema";

export async function signGiftImageUploadAction(input: unknown): Promise<ActionResult<SignedUploadParams>> {
  const parsed = giftImageUploadSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    return success(getGiftModule().signGiftImageUpload(actor, parsed.data));
  }, "signGiftImageUploadAction");
}
