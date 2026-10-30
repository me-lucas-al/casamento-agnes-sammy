import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import { InvalidPublicIdError } from "../errors";
import { isGalleryPublicId, urlReferencesPublicId } from "../lib/public-id";
import type { PhotoRepository } from "../repositories/photo-repository";
import type { NewPhoto, Photo } from "../types";

type Dependencies = { photoRepository: PhotoRepository };

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

export function makeRegisterUploadedPhoto({ photoRepository }: Dependencies) {
  return async function registerUploadedPhoto(
    actor: SessionUser | null,
    input: Input,
  ): Promise<Result> {
    const user = requireRole(actor, ["admin", "couple", "guest"]);
    const isOwned = isGalleryPublicId(input.cloudinaryPublicId);
    if (!isOwned || !urlReferencesPublicId(input.url, input.cloudinaryPublicId)) {
      throw new InvalidPublicIdError();
    }
    const photo = await photoRepository.create(buildNewPhoto(user, input));
    return { photo, changedTags: photo.status === "approved" ? [approvedPhotosTag()] : [] };
  };
}
