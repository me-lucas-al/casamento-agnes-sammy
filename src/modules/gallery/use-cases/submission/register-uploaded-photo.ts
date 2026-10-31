import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { InvalidPublicIdError, PendingPhotoLimitError } from "@/modules/gallery/errors";
import { rejectDuplicatePhotoAsset } from "@/modules/gallery/lib/reject-duplicate-photo-asset";
import { isGalleryPublicId, urlReferencesPublicId } from "@/modules/gallery/lib/public-id";
import { MAX_PENDING_PHOTOS_PER_GUEST } from "@/modules/gallery/lib/upload-rules";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";
import type { NewPhoto, Photo } from "@/modules/gallery/types";

type Dependencies = { photoRepository: PhotoRepository; cloudinaryClient: CloudinaryClient };

type Input = {
  cloudinaryPublicId: string;
  url: string;
  caption?: string | null;
};

type Result = { photo: Photo; changedTags: string[] };

function buildNewPhoto(actor: SessionUser, input: Input): NewPhoto {
  const caption = input.caption?.trim() || null;
  const base = { cloudinaryPublicId: input.cloudinaryPublicId, url: input.url, caption };
  if (actor.role === "guest") {
    if (!actor.guestId) throw new ForbiddenError();
    return { ...base, uploadedByGuestId: actor.guestId, status: "pending" };
  }
  return { ...base, uploadedByUserId: actor.id, status: "approved" };
}

export function makeRegisterUploadedPhoto({ photoRepository, cloudinaryClient }: Dependencies) {
  async function assertPendingQuota(actor: SessionUser): Promise<void> {
    if (actor.role !== "guest" || !actor.guestId) return;
    const pendingCount = await photoRepository.countPendingByGuest(actor.guestId);
    if (pendingCount >= MAX_PENDING_PHOTOS_PER_GUEST) throw new PendingPhotoLimitError();
  }

  return async function registerUploadedPhoto(
    actor: SessionUser | null,
    input: Input,
  ): Promise<Result> {
    const user = requireRole(actor, ["admin", "couple", "guest"]);
    const { cloudinaryPublicId, url } = input;
    const isOwned =
      isGalleryPublicId(cloudinaryPublicId) &&
      urlReferencesPublicId(url, cloudinaryPublicId, cloudinaryClient.cloudName);
    if (!isOwned) throw new InvalidPublicIdError();
    if (await photoRepository.existsWithPublicId(cloudinaryPublicId)) throw new InvalidPublicIdError();
    await assertPendingQuota(user);
    const photo = await rejectDuplicatePhotoAsset(() => photoRepository.create(buildNewPhoto(user, input)));
    return { photo, changedTags: photo.status === "approved" ? [approvedPhotosTag()] : [] };
  };
}
