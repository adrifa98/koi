"use client"

import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"
import { useLocale } from "next-intl"
import Image from "next/image"

export function FeaturedProducts({ products }: { products: Product[] }) {
  const locale = useLocale()

  if (!products?.length) {
    console.log("No featured products available")
    return null
  }

  console.log("Products in FeaturedProducts:", products)

  const [firstProduct, secondProduct, ...otherProducts] = products

  return (
    <section className="container mx-auto grid gap-4 pb-20 pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {firstProduct && (
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100">
            <Link className="relative block h-full w-full" href={`/${locale}/product/${firstProduct.handle}`}>
              {firstProduct.featuredImage?.url ? (
                <Image
                  src={firstProduct.featuredImage.url || "/placeholder.svg"}
                  alt={firstProduct.title}
                  fill
                  sizes="(min-width: 768px) 66vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="text-white">
                  <div className="text-lg font-bold">{firstProduct.title}</div>
                  <div className="mt-2">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: firstProduct.priceRange.maxVariantPrice.currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Number(firstProduct.priceRange.maxVariantPrice.amount))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        {secondProduct && (
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100">
            <Link className="relative block h-full w-full" href={`/${locale}/product/${secondProduct.handle}`}>
              {secondProduct.featuredImage?.url ? (
                <Image
                  src={secondProduct.featuredImage.url || "/placeholder.svg"}
                  alt={secondProduct.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="text-white">
                  <div className="text-lg font-bold">{secondProduct.title}</div>
                  <div className="mt-2">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: secondProduct.priceRange.maxVariantPrice.currencyCode,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Number(secondProduct.priceRange.maxVariantPrice.amount))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
      {otherProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((product) => (
            <div key={product.handle} className="aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100">
              <Link className="relative block h-full w-full" href={`/${locale}/product/${product.handle}`}>
                {product.featuredImage?.url ? (
                  <Image
                    src={product.featuredImage.url || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    <div className="text-lg font-bold">{product.title}</div>
                    <div className="mt-2">
                      {new Intl.NumberFormat(locale, {
                        style: "currency",
                        currency: product.priceRange.maxVariantPrice.currencyCode,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(Number(product.priceRange.maxVariantPrice.amount))}
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

