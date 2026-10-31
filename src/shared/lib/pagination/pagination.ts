import { z } from "zod";
import { firstValue, type SearchParams } from "../url/url-params";

export const PER_PAGE_OPTIONS = [12, 24, 48] as const;
export const DEFAULT_PER_PAGE = 12;

export type PageParams = {
  page: number;
  perPage: number;
  offset: number;
};

export type PageResult<Item> = {
  items: Item[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

const pageSchema = z.coerce.number().int().min(1).catch(1);

const perPageSchema = z.coerce
  .number()
  .int()
  .refine((value) => PER_PAGE_OPTIONS.some((option) => option === value))
  .catch(DEFAULT_PER_PAGE);

export function parsePageParams(searchParams: SearchParams): PageParams {
  const page = pageSchema.parse(firstValue(searchParams.page));
  const perPage = perPageSchema.parse(firstValue(searchParams.perPage));
  return { page, perPage, offset: (page - 1) * perPage };
}

type BuildPageResultInput<Item> = {
  items: Item[];
  total: number;
  page: number;
  perPage: number;
};

export function buildPageResult<Item>({
  items,
  total,
  page,
  perPage,
}: BuildPageResultInput<Item>): PageResult<Item> {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return {
    items,
    total,
    page,
    perPage,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
