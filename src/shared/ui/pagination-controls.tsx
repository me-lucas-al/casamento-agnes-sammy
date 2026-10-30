import Link from "next/link";
import type { PageResult } from "@/shared/lib/pagination";
import { buildPaginationLinks, type PaginationLink } from "@/shared/lib/pagination-links";
import type { SearchParams } from "@/shared/lib/url-params";
import { cn } from "@/shared/lib/utils";

type PaginationControlsProps = {
  basePath: string;
  searchParams: SearchParams;
  pageResult: Pick<PageResult<unknown>, "page" | "totalPages" | "hasPreviousPage" | "hasNextPage">;
};

const baseClassName = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-4 text-base";

function PaginationStep({ link }: { link: PaginationLink }) {
  if (link.href === null) {
    return (
      <span aria-disabled="true" className={cn(baseClassName, "opacity-50")}>
        {link.label}
      </span>
    );
  }
  return (
    <Link href={link.href} className={cn(baseClassName, "hover:bg-muted")}>
      {link.label}
    </Link>
  );
}

export function PaginationControls({ basePath, searchParams, pageResult }: PaginationControlsProps) {
  if (pageResult.totalPages <= 1) return null;
  const { previous, next } = buildPaginationLinks(basePath, searchParams, pageResult);
  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-3">
      <PaginationStep link={previous} />
      <span className="text-base">
        Página {pageResult.page} de {pageResult.totalPages}
      </span>
      <PaginationStep link={next} />
    </nav>
  );
}
