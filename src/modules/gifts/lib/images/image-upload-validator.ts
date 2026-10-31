export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type ImageRejectionReason = "type" | "size" | "empty";

export type ImageUploadCandidate = {
  contentType: string;
  sizeBytes: number;
};

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; reason: ImageRejectionReason };

function isAllowedType(contentType: string): boolean {
  return ALLOWED_IMAGE_TYPES.some((allowedType) => allowedType === contentType);
}

export function validateImageUpload({ contentType, sizeBytes }: ImageUploadCandidate): ImageValidationResult {
  if (!isAllowedType(contentType)) return { valid: false, reason: "type" };
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return { valid: false, reason: "empty" };
  if (sizeBytes > MAX_IMAGE_SIZE_BYTES) return { valid: false, reason: "size" };
  return { valid: true };
}
