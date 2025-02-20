import ProductGrid from "@/components/shop/product-grid"
import { defaultSort, sorting } from "@/lib/constants"
import { getCollection, getCollectionProducts } from "@/lib/shopify"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

interface Props {
  params: {
    collection: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection(params.collection)

  if (!collection) return notFound()

  return {
    title: collection.title,
    description: collection.description,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { collection } = params
  const { sort } = searchParams as { [key: string]: string }
  const sortItem = sorting.find((item) => item.slug === sort) || defaultSort

  const t = await getTranslations("search")

  const [collectionData, products] = await Promise.all([
    getCollection(collection),
    getCollectionProducts({
      collection,
      sortKey: sortItem.sortKey,
      reverse: sortItem.reverse,
    }),
  ])

  if (!collectionData || !products) return notFound()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{collectionData.title}</h1>
        {collectionData.description && <p className="text-sm text-muted-foreground">{collectionData.description}</p>}
      </div>
      <ProductGrid products={products} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
    </div>
  )
}

