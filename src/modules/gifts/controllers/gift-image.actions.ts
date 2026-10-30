"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import type { SignedUploadParams } from "@/shared/lib/cloudinary";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeGiftError } from "../errors";
import { getGiftModule } from "../factory";
import { giftImageUploadSchema } from "../schemas/gift-image-upload.schema";

export async function signGiftImageUploadAction(input: unknown): Promise<ActionResult<SignedUploadParams>> {
  const parsed = giftImageUploadSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGiftError, async () => {
    const actor = await getSessionUser();
    return success(getGiftModule().signGiftImageUpload(actor, parsed.data));
  }, "signGiftImageUploadAction");
}
