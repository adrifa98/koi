import { ShopContent } from "@/components/shop/shop-content"
import { getCollectionProducts, getProducts } from "@/lib/shopify"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the latest products from our store.",
}

export default async function ShopPage() {
  try {
    // Get all products and products by category
    const [allProducts, accesorios, equipacion, lifestyle, outlet] = await Promise.all([
      getProducts({ sortKey: "CREATED_AT", reverse: true }), // Get latest products first
      getCollectionProducts({ collection: "accesorios", sortKey: "RELEVANCE", reverse: false }).catch(() => []),
      getCollectionProducts({ collection: "equipacion", sortKey: "RELEVANCE", reverse: false }).catch(() => []),
      getCollectionProducts({ collection: "lifestyle", sortKey: "RELEVANCE", reverse: false }).catch(() => []),
      getCollectionProducts({ collection: "outlet", sortKey: "RELEVANCE", reverse: false }).catch(() => []),
    ])

    console.log("All Products:", allProducts)
    console.log("First product structure:", allProducts[0])

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
  } catch (error) {
    console.error("Error loading shop page:", error)
    throw error
  }
}

