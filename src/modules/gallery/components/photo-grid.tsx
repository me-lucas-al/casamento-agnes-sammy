import Image from "next/image";
import type { PublicPhoto } from "../types";

type PhotoGridProps = { photos: PublicPhoto[] };

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <li key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-paper-dark">
          <Image
            src={photo.url}
            alt={photo.caption ?? "Foto do casamento"}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
