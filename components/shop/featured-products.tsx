"use client"

import { GridTileImage } from "@/components/grid/tile"
import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null

  const [firstProduct, secondProduct, ...otherProducts] = products

  return (
    <section className="container grid gap-4 pb-20 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {firstProduct && (
          <div className="aspect-[16/9]">
            <Link className="relative h-full w-full" href={`/product/${firstProduct.handle}`}>
              <GridTileImage
                src={firstProduct.featuredImage?.url ?? "/placeholder.svg"}
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                priority
                alt={firstProduct.title}
                label={{
                  title: firstProduct.title,
                  amount: firstProduct.priceRange.maxVariantPrice.amount,
                  currencyCode: firstProduct.priceRange.maxVariantPrice.currencyCode,
                }}
              />
            </Link>
          </div>
        )}
        {secondProduct && (
          <div className="aspect-[16/9]">
            <Link className="relative h-full w-full" href={`/product/${secondProduct.handle}`}>
              <GridTileImage
                src={secondProduct.featuredImage?.url ?? "/placeholder.svg"}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                priority
                alt={secondProduct.title}
                label={{
                  title: secondProduct.title,
                  amount: secondProduct.priceRange.maxVariantPrice.amount,
                  currencyCode: secondProduct.priceRange.maxVariantPrice.currencyCode,
                }}
              />
            </Link>
          </div>
        )}
      </div>
      {otherProducts?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((product) => (
            <div key={product.handle} className="aspect-[16/9]">
              <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
                <GridTileImage
                  src={product.featuredImage?.url ?? "/placeholder.svg"}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  priority
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
      )}
    </section>
  )
}

