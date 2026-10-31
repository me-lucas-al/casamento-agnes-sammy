export type SearchParams = Record<string, string | string[] | undefined>;

export type QueryChanges = Record<string, string | number | null | undefined>;

const MAX_TEXT_PARAM_LENGTH = 100;

export function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function textParam(searchParams: SearchParams, key: string): string {
  const value = firstValue(searchParams[key]);
  if (!value) return "";
  return value.trim().slice(0, MAX_TEXT_PARAM_LENGTH);
}

export function enumParam<Option extends string>(
  searchParams: SearchParams,
  key: string,
  allowedOptions: readonly Option[],
): Option | undefined {
  const value = firstValue(searchParams[key]);
  return allowedOptions.find((option) => option === value);
}

function isFilled(value: string | number | null | undefined): value is string | number {
  return value !== null && value !== undefined && value !== "";
}

export function buildQueryString(current: SearchParams, changes: QueryChanges): string {
  const merged: QueryChanges = { ...flattenSearchParams(current), ...changes };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (isFilled(value)) query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

function flattenSearchParams(searchParams: SearchParams): QueryChanges {
  const entries = Object.entries(searchParams).map(([key, value]) => [key, firstValue(value)]);
  return Object.fromEntries(entries);
}
