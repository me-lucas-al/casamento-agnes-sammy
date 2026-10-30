import { ALLOWED_PHOTO_MIME_TYPES, MAX_PHOTO_BYTES } from "./upload-rules";

export type UploadCandidate = {
  mimeType: string;
  sizeBytes: number;
};

export type UploadViolation = "mime" | "size";

export function findUploadViolation({ mimeType, sizeBytes }: UploadCandidate): UploadViolation | null {
  const isAllowedMime = ALLOWED_PHOTO_MIME_TYPES.some((allowed) => allowed === mimeType);
  if (!isAllowedMime) return "mime";
  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_PHOTO_BYTES) return "size";
  return null;
}
