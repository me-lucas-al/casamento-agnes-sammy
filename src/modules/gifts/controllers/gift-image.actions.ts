"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import type { SignedUploadParams } from "@/shared/lib/cloudinary";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeGiftError } from "../errors";
import { getGiftModule } from "../factory";
import { giftImageUploadSchema } from "../schemas/gift-image-upload.schema";

export async function signGiftImageUploadAction(input: unknown): Promise<ActionResult<SignedUploadParams>> {
  const parsed = giftImageUploadSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    return success(getGiftModule().signGiftImageUpload(actor, parsed.data));
  } catch (error) {
    return failure(describeGiftError(error));
  }
}
