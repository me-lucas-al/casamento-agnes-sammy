import Image from "next/image";

type GiftThumbnailProps = {
  imageUrl: string | null;
  name: string;
};

export function GiftThumbnail({ imageUrl, name }: GiftThumbnailProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-dark">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-blush/60">
          <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-2/3 w-auto opacity-40" />
        </div>
      )}
    </div>
  );
}
