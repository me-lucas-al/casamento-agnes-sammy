import { isUniqueViolation } from "@/shared/lib/unique-violation";
import { GiftCategoryNameTakenError, GiftNameTakenError } from "@/modules/gifts/errors";

export const GIFT_NAME_UNIQUE_INDEX = "gifts_name_lower_unique_idx";
export const CATEGORY_NAME_UNIQUE_INDEX = "gift_categories_name_lower_unique_idx";

export async function rejectDuplicateGiftName<Result>(operation: () => Promise<Result>): Promise<Result> {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error, GIFT_NAME_UNIQUE_INDEX)) throw new GiftNameTakenError();
    throw error;
  }
}

export async function rejectDuplicateCategoryName<Result>(operation: () => Promise<Result>): Promise<Result> {
  try {
    return await operation();
  } catch (error) {
    if (isUniqueViolation(error, CATEGORY_NAME_UNIQUE_INDEX)) throw new GiftCategoryNameTakenError();
    throw error;
  }
}
