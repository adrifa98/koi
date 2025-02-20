"use client"

import { Link } from "@/i18n/routing"
import type { Product } from "@/lib/shopify/types"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import Image from "next/image"

interface ProductGridProps {
  products: Product[]
  className?: string
}

export default function ProductGrid({ products, className }: ProductGridProps) {
  const locale = useLocale()

  if (!products?.length) return null

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {products.map((product) => (
        <Link
          key={product.handle}
          className="group relative aspect-square bg-neutral-100 rounded-lg overflow-hidden dark:bg-neutral-900"
          href={`/product/${product.handle}`}
        >
          <Image
            src={product.featuredImage?.url || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-medium">{product.title}</h3>
            <p className="text-white/90 text-sm">
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: product.priceRange.maxVariantPrice.currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number.parseFloat(product.priceRange.maxVariantPrice.amount))}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

