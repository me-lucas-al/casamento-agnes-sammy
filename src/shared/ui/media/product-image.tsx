"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/styling/utils";

type ProductImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function MonogramPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center bg-blush/60">
      <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-2/3 w-auto opacity-40" />
    </div>
  );
}

export function ProductImage({ src, alt, sizes, priority = false, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const canShowImage = src !== null && failedSrc !== src;
  return (
    <div className={cn("relative aspect-4/3 w-full overflow-hidden bg-paper-dark", className)}>
      {canShowImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
          className="object-cover"
        />
      ) : (
        <MonogramPlaceholder />
      )}
    </div>
  );
}
