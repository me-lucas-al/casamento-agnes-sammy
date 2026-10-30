import type { PageResult } from "./pagination";
import { buildQueryString, type SearchParams } from "./url-params";

type PaginationState = Pick<PageResult<unknown>, "page" | "hasPreviousPage" | "hasNextPage">;

export type PaginationLink = { label: string; href: string | null };

export function buildPaginationLinks(
  basePath: string,
  searchParams: SearchParams,
  { page, hasPreviousPage, hasNextPage }: PaginationState,
): { previous: PaginationLink; next: PaginationLink } {
  const hrefForPage = (target: number) => `${basePath}${buildQueryString(searchParams, { page: target })}`;
  return {
    previous: { label: "Anterior", href: hasPreviousPage ? hrefForPage(page - 1) : null },
    next: { label: "Próxima", href: hasNextPage ? hrefForPage(page + 1) : null },
  };
}
