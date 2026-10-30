import Link from "next/link";
import { buildQueryString, type SearchParams } from "@/shared/lib/url-params";
import { cn } from "@/shared/lib/utils";
import type { PhotoStatus } from "../types";

type StatusFilterProps = {
  basePath: string;
  searchParams: SearchParams;
  activeStatus?: PhotoStatus;
};

const options: { label: string; status?: PhotoStatus }[] = [
  { label: "Todas" },
  { label: "Pendentes", status: "pending" },
  { label: "Aprovadas", status: "approved" },
  { label: "Rejeitadas", status: "rejected" },
];

export function StatusFilter({ basePath, searchParams, activeStatus }: StatusFilterProps) {
  return (
    <nav aria-label="Filtrar por status" className="flex flex-wrap gap-2">
      {options.map(({ label, status }) => (
        <Link
          key={label}
          href={`${basePath}${buildQueryString(searchParams, { status, page: 1 })}`}
          aria-current={status === activeStatus ? "page" : undefined}
          className={cn(
            "rounded-full border px-3 py-1 text-sm",
            status === activeStatus && "bg-rose text-white",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
