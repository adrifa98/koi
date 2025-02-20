import { ShopContent } from "@/components/shop/shop-content"
import { getCollectionProducts, getProducts } from "@/lib/shopify"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the latest products from our store.",
}

export default async function ShopPage() {
  // Get all products and products by category
  const [allProducts, accesorios, equipacion, lifestyle, outlet] = await Promise.all([
    getProducts({}),
    getCollectionProducts({ collection: "accesorios", sortKey: "RELEVANCE", reverse: false }),
    getCollectionProducts({ collection: "equipacion", sortKey: "RELEVANCE", reverse: false }),
    getCollectionProducts({ collection: "lifestyle", sortKey: "RELEVANCE", reverse: false }),
    getCollectionProducts({ collection: "outlet", sortKey: "RELEVANCE", reverse: false }),
  ])

  return (
    <ShopContent
      products={allProducts}
      categoryProducts={{
        accesorios,
        equipacion,
        lifestyle,
        outlet,
      }}
    />
  )
}

