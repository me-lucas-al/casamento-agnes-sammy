import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = { title: string; href: string };

export function BrandMark({ title, href }: BrandMarkProps) {
  return (
    <Link href={href} className="flex min-h-11 items-center gap-2 whitespace-nowrap">
      <Image src="/brand/monogram.png" alt="" width={168} height={300} className="h-10 w-auto" />
      <span className="font-script text-3xl leading-none text-wine">{title}</span>
    </Link>
  );
}
