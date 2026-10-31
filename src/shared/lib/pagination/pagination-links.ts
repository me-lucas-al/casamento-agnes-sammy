import type { PageResult } from "./pagination";
import { buildQueryString, type SearchParams } from "../url/url-params";

type PaginationState = Pick<PageResult<unknown>, "page" | "hasPreviousPage" | "hasNextPage"> &
  Partial<Pick<PageResult<unknown>, "totalPages">>;

export type PaginationLink = { label: string; href: string | null };

export function buildPaginationLinks(
  basePath: string,
  searchParams: SearchParams,
  { page, hasPreviousPage, hasNextPage, totalPages = Number.POSITIVE_INFINITY }: PaginationState,
): { previous: PaginationLink; next: PaginationLink } {
  const hrefForPage = (target: number) => `${basePath}${buildQueryString(searchParams, { page: target })}`;
  const previousPage = Math.min(page - 1, totalPages);
  return {
    previous: { label: "Anterior", href: hasPreviousPage ? hrefForPage(previousPage) : null },
    next: { label: "Próxima", href: hasNextPage ? hrefForPage(page + 1) : null },
  };
}
