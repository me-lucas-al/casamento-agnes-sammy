import Link from "next/link";
import type { PageResult } from "@/shared/lib/pagination";
import { buildQueryString, type SearchParams } from "@/shared/lib/url-params";
import { cn } from "@/shared/lib/utils";

type PaginationControlsProps = {
  basePath: string;
  searchParams: SearchParams;
  pageResult: Pick<PageResult<unknown>, "page" | "totalPages" | "hasPreviousPage" | "hasNextPage">;
};

const linkClassName = "rounded-lg border px-3 py-1.5 text-sm hover:bg-muted";
const disabledClassName = "pointer-events-none opacity-50";

export function PaginationControls({
  basePath,
  searchParams,
  pageResult,
}: PaginationControlsProps) {
  const { page, totalPages, hasPreviousPage, hasNextPage } = pageResult;
  const hrefForPage = (target: number) =>
    `${basePath}${buildQueryString(searchParams, { page: target })}`;

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-3">
      <Link
        href={hrefForPage(page - 1)}
        aria-disabled={!hasPreviousPage}
        className={cn(linkClassName, !hasPreviousPage && disabledClassName)}
      >
        Anterior
      </Link>
      <span className="text-sm">
        Página {page} de {totalPages}
      </span>
      <Link
        href={hrefForPage(page + 1)}
        aria-disabled={!hasNextPage}
        className={cn(linkClassName, !hasNextPage && disabledClassName)}
      >
        Próxima
      </Link>
    </nav>
  );
}
