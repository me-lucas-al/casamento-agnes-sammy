import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/styling/utils";

type StoreLinkProps = {
  productUrl: string | null;
  className?: string;
};

export function StoreLink({ productUrl, className }: StoreLinkProps) {
  if (!productUrl) return null;
  return (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-gold bg-card px-4 text-sm font-semibold text-wine transition-colors hover:bg-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine",
        className,
      )}
    >
      Ver na loja
      <ExternalLink aria-hidden className="size-4" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
