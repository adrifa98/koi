"use client"

import { addItem } from "@/components/cart/actions"
import { useProduct } from "@/components/product/product-context"
import type { Product, ProductVariant } from "@/lib/shopify/types"
import { PlusIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { useCart } from "./cart-context"

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isPending,
  t,
}: {
  availableForSale: boolean
  selectedVariantId: string | undefined
  isPending: boolean
  t: (key: string) => string
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white"
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60"

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        {t("outOfStock")}
      </button>
    )
  }

  if (!selectedVariantId) {
    return (
      <button aria-label={t("selectOption")} disabled className={clsx(buttonClasses, disabledClasses)}>
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        {t("addToCart")}
      </button>
    )
  }

  return (
    <button
      aria-label={t("addToCart")}
      className={clsx(buttonClasses, {
        "hover:opacity-90": !isPending,
      })}
      disabled={isPending}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {isPending ? t("adding") : t("addToCart")}
    </button>
  )
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product
  const { addCartItem } = useCart()
  const { state } = useProduct()
  const t = useTranslations("cart")

  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()]),
  )
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined
  const selectedVariantId = variant?.id || defaultVariantId
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)!

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      setMessage(t("selectOption"))
      return
    }

    startTransition(async () => {
      addCartItem(finalVariant, product)
      const result = await addItem("", selectedVariantId)

      if (result === "Error adding item to cart") {
        setMessage(t("error"))
      } else {
        setMessage(t("added"))
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleAddToCart()
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isPending={isPending}
        t={t}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}

