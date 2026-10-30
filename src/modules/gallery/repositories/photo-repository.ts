import type {
  ApprovedPhotosQuery,
  NewPhoto,
  PanelPhotosQuery,
  Photo,
  PhotoListPage,
  PhotoStatus,
  PublicPhoto,
} from "../types";

export interface PhotoRepository {
  create(newPhoto: NewPhoto): Promise<Photo>;
  findById(photoId: string): Promise<Photo | null>;
  updateStatus(photoId: string, status: PhotoStatus): Promise<Photo | null>;
  updateCaption(photoId: string, caption: string | null): Promise<Photo | null>;
  deleteById(photoId: string): Promise<void>;
  listApprovedPage(query: ApprovedPhotosQuery): Promise<PhotoListPage<PublicPhoto>>;
  listPanelPage(query: PanelPhotosQuery): Promise<PhotoListPage<Photo>>;
  countPendingByGuest(guestId: string): Promise<number>;
}
