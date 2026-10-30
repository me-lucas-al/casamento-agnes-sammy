import Image from "next/image";
import type { Photo, PhotoStatus } from "../types";
import { ModerationButtons } from "./moderation-buttons";

type ModerationQueueProps = { photos: Photo[] };

const statusLabels: Record<PhotoStatus, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
};

export function ModerationQueue({ photos }: ModerationQueueProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <li key={photo.id} className="flex flex-col gap-3 rounded-xl bg-paper-dark p-3">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={photo.url}
              alt={photo.caption ?? "Foto enviada"}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="text-sm text-wine">
            {statusLabels[photo.status]}
            {photo.caption ? ` · ${photo.caption}` : ""}
          </p>
          <ModerationButtons photoId={photo.id} status={photo.status} />
        </li>
      ))}
    </ul>
  );
}
