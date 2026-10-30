import { isUniqueViolation } from "@/shared/lib/unique-violation";
import { InvalidGiftImageError } from "../errors";

export const GIFT_IMAGE_UNIQUE_INDEX = "gifts_image_public_id_unique_idx";

export async function rejectDuplicateGiftImage<Result>(operation: () => Promise<Result>): Promise<Result> {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error, GIFT_IMAGE_UNIQUE_INDEX)) throw new InvalidGiftImageError();
    throw error;
  }
}
