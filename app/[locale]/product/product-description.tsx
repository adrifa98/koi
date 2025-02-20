"use client"

import { AddToCart } from "@/components/cart/add-to-cart"
import Price from "@/components/price"
import { useProduct } from "@/components/product/product-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/shopify/types"
import { useTranslations } from "next-intl"

export function ProductDescription({ product }: { product: Product }) {
  const { state, updateOption } = useProduct()
  const t = useTranslations("product")

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-border pb-6">
        <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-card p-2 text-sm">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        {product.options
          .filter((option) => option.values.length > 1)
          .map((option) => (
            <div key={option.name} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">{option.name}</h3>
              <Select
                value={state[option.name.toLowerCase()]}
                onValueChange={(value) => updateOption(option.name.toLowerCase(), value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.values.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
      </div>

      {product.descriptionHtml ? (
        <div
          className="mb-6 text-sm leading-tight text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}

      <AddToCart product={product} />
    </>
  )
}

