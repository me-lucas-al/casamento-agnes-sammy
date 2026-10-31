import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient, SignedUploadParams } from "@/shared/lib/cloudinary";
import { buildManagedPublicId } from "@/shared/lib/cloudinary-url";
import { InvalidImageUploadError } from "@/modules/gifts/errors";
import { GIFT_IMAGE_FOLDER } from "@/modules/gifts/lib/images/gift-image-rules";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import { validateImageUpload, type ImageUploadCandidate } from "@/modules/gifts/lib/images/image-upload-validator";


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
