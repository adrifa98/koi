"use client"

import { GridTileImage } from "@/components/grid/tile"
import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"

interface ProductGridProps {
  products: Product[]
  className?: string
}

export default function ProductGrid({ products, className }: ProductGridProps) {
  const locale = useLocale()

  if (!products?.length) return null

  return (
    <div className={cn("grid gap-4", className)}>
      {products.map((product) => (
        <div key={product.handle} className="aspect-square">
          <Link className="relative h-full w-full" href={`/${locale}/product/${product.handle}`}>
            <GridTileImage
              src={product.featuredImage?.url ?? "/placeholder.svg"}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
            />
          </Link>
        </div>
      ))}
    </div>
  )
}

