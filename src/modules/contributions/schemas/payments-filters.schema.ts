import { enumParam, textParam, type SearchParams } from "@/shared/lib/url/url-params";
import {
  CONTRIBUTION_STATUSES,
  PAYMENT_SORTS,
  type PaymentSort,
  type PaymentStatusFilter,
} from "../types";

export const PAYMENT_STATUS_FILTERS = [...CONTRIBUTION_STATUSES, "all"] as const;

export type PaymentsFilters = {
  status: PaymentStatusFilter;
  search: string;
  sort: PaymentSort;
};

export function parsePaymentsFilters(searchParams: SearchParams): PaymentsFilters {
  return {
    status: enumParam(searchParams, "status", PAYMENT_STATUS_FILTERS) ?? "reserved",
    search: textParam(searchParams, "search"),
    sort: enumParam(searchParams, "sort", PAYMENT_SORTS) ?? "newest",
  };
}
