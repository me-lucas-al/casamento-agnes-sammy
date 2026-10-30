import { isUniqueViolation } from "@/shared/lib/unique-violation";
import { InvalidPublicIdError } from "../errors";

export const PHOTO_PUBLIC_ID_UNIQUE_INDEX = "photos_cloudinary_public_id_unique_idx";

export async function rejectDuplicatePhotoAsset<Result>(operation: () => Promise<Result>): Promise<Result> {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error, PHOTO_PUBLIC_ID_UNIQUE_INDEX)) throw new InvalidPublicIdError();
    throw error;
  }
}
