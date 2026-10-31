import { PRICE_BANDS } from "@/modules/gifts/lib/pricing/price-band";
import { fieldControlClassName, FormField } from "@/modules/gifts/components/form/form-field";
import { PER_PAGE_OPTIONS } from "@/shared/lib/pagination/pagination";
import { SUGGESTION_CATEGORIES } from "@/modules/gift-suggestions/data/category-names";
import { PRODUCT_TYPE_LABELS, type ProductTypeId } from "@/modules/gift-suggestions/data/product-types";
import { STORE_IDS, STORE_LABELS } from "@/modules/gift-suggestions/data/stores";
import { MODE_FILTER_OPTIONS, SORT_LABELS } from "@/modules/gift-suggestions/lib/catalog/suggestion-labels";
import { SUGGESTION_SORTS, type SuggestionQuery } from "@/modules/gift-suggestions/lib/filters/suggestion-query";
import type { SearchParams } from "@/shared/lib/url/url-params";

type SuggestionFilterFieldsProps = {
  query: SuggestionQuery;
  values: SearchParams;
};

function text(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function SuggestionFilterFields({ query, values }: SuggestionFilterFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gold/40 bg-white p-4 sm:grid-cols-2 lg:grid-cols-1">
      <FormField label="Categoria">
        <select name="categoria" defaultValue={query.category ?? ""} className={fieldControlClassName}>
          <option value="">Todas</option>
          {SUGGESTION_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>{category.name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Tipo de produto">
        <select name="tipo" defaultValue={query.type ?? ""} className={fieldControlClassName}>
          <option value="">Todos</option>
          {(Object.keys(PRODUCT_TYPE_LABELS) as ProductTypeId[]).map((typeId) => (
            <option key={typeId} value={typeId}>{PRODUCT_TYPE_LABELS[typeId]}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Faixa de valor">
        <select name="faixa" defaultValue={query.band ?? ""} className={fieldControlClassName}>
          <option value="">Qualquer valor</option>
          {PRICE_BANDS.map((band) => (
            <option key={band.id} value={band.id}>{band.label}</option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Preço mínimo (R$)">
          <input name="precoMin" inputMode="decimal" defaultValue={text(values.precoMin)} placeholder="0" className={fieldControlClassName} />
        </FormField>
        <FormField label="Preço máximo (R$)">
          <input name="precoMax" inputMode="decimal" defaultValue={text(values.precoMax)} placeholder="Sem limite" className={fieldControlClassName} />
        </FormField>
      </div>
      <FormField label="Modo do presente">
        <select name="modo" defaultValue={text(values.modo)} className={fieldControlClassName}>
          <option value="">Todos</option>
          {MODE_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Ordenar por">
        <select name="sort" defaultValue={query.sort} className={fieldControlClassName}>
          {SUGGESTION_SORTS.map((sort) => (
            <option key={sort} value={sort}>{SORT_LABELS[sort]}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Itens por página">
        <select name="perPage" defaultValue={String(query.perPage)} className={fieldControlClassName}>
          {PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </FormField>
      <fieldset className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
        <legend className="mb-1 text-sm font-medium text-wine">Loja</legend>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          {STORE_IDS.map((storeId) => (
            <label key={storeId} className="flex min-h-11 cursor-pointer items-center gap-2 text-base">
              <input type="checkbox" name="loja" value={storeId} defaultChecked={query.stores.includes(storeId)} className="size-5 accent-rose" />
              {STORE_LABELS[storeId]}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
