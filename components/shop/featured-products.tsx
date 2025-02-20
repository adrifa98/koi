"use client"

import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"
import Image from "next/image"

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products?.length) return null

  const [firstProduct, secondProduct, ...otherProducts] = products

  return (
    <section className="container grid gap-4 pb-20 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {firstProduct && (
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
            <Link className="relative h-full w-full" href={`/product/${firstProduct.handle}`}>
              <Image
                src={firstProduct.featuredImage?.url ?? "/placeholder.svg"}
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                priority
                alt={firstProduct.title}
                className="object-cover transition-transform hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="text-white">
                  <div className="text-lg font-bold">{firstProduct.title}</div>
                  <div className="mt-2">
                    {firstProduct.priceRange.maxVariantPrice.amount}{" "}
                    {firstProduct.priceRange.maxVariantPrice.currencyCode}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        {secondProduct && (
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
            <Link className="relative h-full w-full" href={`/product/${secondProduct.handle}`}>
              <Image
                src={secondProduct.featuredImage?.url ?? "/placeholder.svg"}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                priority
                alt={secondProduct.title}
                className="object-cover transition-transform hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="text-white">
                  <div className="text-lg font-bold">{secondProduct.title}</div>
                  <div className="mt-2">
                    {secondProduct.priceRange.maxVariantPrice.amount}{" "}
                    {secondProduct.priceRange.maxVariantPrice.currencyCode}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
      {otherProducts?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((product) => (
            <div key={product.handle} className="aspect-[16/9] relative overflow-hidden rounded-lg">
              <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
                <Image
                  src={product.featuredImage?.url ?? "/placeholder.svg"}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  priority
                  alt={product.title}
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    <div className="text-lg font-bold">{product.title}</div>
                    <div className="mt-2">
                      {product.priceRange.maxVariantPrice.amount} {product.priceRange.maxVariantPrice.currencyCode}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

