import Link from "next/link";
import { buildQueryString, type SearchParams } from "@/shared/lib/url-params";
import { cn } from "@/shared/lib/utils";
import { SUGGESTION_CATEGORIES, type SuggestionCategoryKey } from "@/modules/gift-suggestions/data/category-names";

type CategoryQuickLinksProps = {
  basePath: string;
  params: SearchParams;
  activeCategory: SuggestionCategoryKey | undefined;
};

const chipClassName = "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-base";

export function CategoryQuickLinks({ basePath, params, activeCategory }: CategoryQuickLinksProps) {
  const options = [{ key: undefined, name: "Todas" }, ...SUGGESTION_CATEGORIES];
  return (
    <nav aria-label="Categorias" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none]">
      {options.map(({ key, name }) => {
        const isActive = key === activeCategory;
        const href = `${basePath}${buildQueryString(params, { categoria: key ?? null, page: null })}`;
        return (
          <Link
            key={key ?? "todas"}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={cn(chipClassName, isActive ? "border-wine bg-wine text-paper" : "border-gold/60 bg-card text-wine hover:bg-blush")}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
