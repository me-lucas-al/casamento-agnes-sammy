import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient, SignedUploadParams } from "@/shared/lib/cloudinary";
import { buildManagedPublicId } from "@/shared/lib/cloudinary-url";
import { InvalidImageUploadError } from "../errors";
import { GIFT_IMAGE_FOLDER } from "../lib/gift-image-rules";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import { validateImageUpload, type ImageUploadCandidate } from "../lib/image-upload-validator";


type Dependencies = { cloudinaryClient: CloudinaryClient };

export function makeSignGiftImageUpload({ cloudinaryClient }: Dependencies) {
  return function signGiftImageUpload(
    actor: SessionUser | null,
    candidate: ImageUploadCandidate,
  ): SignedUploadParams {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const validation = validateImageUpload(candidate);
    if (!validation.valid) throw new InvalidImageUploadError(validation.reason);
    return cloudinaryClient.signUpload(buildManagedPublicId(GIFT_IMAGE_FOLDER));
  };
}
