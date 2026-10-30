import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient, SignedUploadParams } from "@/shared/lib/cloudinary";
import { buildManagedPublicId } from "@/shared/lib/cloudinary-url";
import { InvalidUploadError } from "../errors";
import { GALLERY_FOLDER } from "../lib/upload-rules";
import { findUploadViolation, type UploadCandidate } from "../lib/upload-validator";

type Dependencies = { cloudinaryClient: CloudinaryClient };

export function makeSignUploadPhoto({ cloudinaryClient }: Dependencies) {
  return async function signUploadPhoto(
    actor: SessionUser | null,
    candidate: UploadCandidate,
  ): Promise<SignedUploadParams> {
    requireRole(actor, ["admin", "couple", "guest"]);
    const violation = findUploadViolation(candidate);
    if (violation) throw new InvalidUploadError(violation);
    return cloudinaryClient.signUpload(buildManagedPublicId(GALLERY_FOLDER));
  };
}
