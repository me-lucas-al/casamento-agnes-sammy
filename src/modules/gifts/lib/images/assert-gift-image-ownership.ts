import type { CloudinaryClient } from "@/shared/lib/cloudinary/cloudinary";
import { isManagedPublicId, urlReferencesCloudinaryAsset } from "@/shared/lib/cloudinary/cloudinary-url";
import { InvalidGiftImageError } from "@/modules/gifts/errors";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { GiftImage } from "@/modules/gifts/types";
import { GIFT_IMAGE_FOLDER } from "./gift-image-rules";

type Dependencies = { giftRepository: GiftRepository; cloudinaryClient: CloudinaryClient };

export async function assertGiftImageOwnership(
  { giftRepository, cloudinaryClient }: Dependencies,
  image: GiftImage,
  excludedGiftId?: string,
): Promise<void> {
  const { publicId, url } = image;
  const isOwned =
    isManagedPublicId(GIFT_IMAGE_FOLDER, publicId) &&
    urlReferencesCloudinaryAsset({ url, publicId, cloudName: cloudinaryClient.cloudName });
  if (!isOwned) throw new InvalidGiftImageError();
  if (await giftRepository.existsWithImagePublicId(publicId, excludedGiftId)) throw new InvalidGiftImageError();
}
