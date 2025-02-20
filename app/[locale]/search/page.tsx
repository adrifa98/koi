import ProductGrid from "@/components/shop/product-grid";
import { defaultSort, sorting } from "@/lib/constants";
import { getProducts } from "@/lib/shopify";
import { getTranslations } from 'next-intl/server';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string }
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort
  const t = await getTranslations("search")

  const products = await getProducts({ sortKey, reverse, query: searchValue })

  return (
    <div className="space-y-6">
      {searchValue && (
        <p className="text-sm text-muted-foreground">
          {products.length === 0
            ? t("results.noResults", { query: searchValue })
            : t("results.showing", { count: products.length, query: searchValue })}
        </p>
      )}
      <ProductGrid products={products} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
    </div>
  )
}

