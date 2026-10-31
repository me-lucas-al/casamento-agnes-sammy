import Link from "next/link";
import { buildQueryString, type SearchParams } from "@/shared/lib/url/url-params";
import { cn } from "@/shared/lib/styling/utils";

type StatusFilterOption = { value: string; label: string };

type StatusFilterLinksProps = {
  basePath: string;
  searchParams: SearchParams;
  activeValue: string | undefined;
  options: StatusFilterOption[];
};

export function StatusFilterLinks({ basePath, searchParams, activeValue, options }: StatusFilterLinksProps) {
  const allOptions = [{ value: "", label: "Todos" }, ...options];
  return (
    <nav aria-label="Filtro de status" className="flex flex-wrap gap-2">
      {allOptions.map(({ value, label }) => {
        const isActive = (activeValue ?? "") === value;
        const href = `${basePath}${buildQueryString(searchParams, { status: value, page: 1 })}`;
        return (
          <Link
            key={value}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={cn("inline-flex min-h-11 items-center rounded-full border border-input px-4 text-base", isActive && "bg-primary text-primary-foreground")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
