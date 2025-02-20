"use client"

import { removeItem } from "@/components/cart/actions"
import type { CartItem } from "@/lib/shopify/types"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem
  optimisticUpdate: any
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("cart")

  const merchandiseId = item.merchandise.id

  const handleRemoveItem = async () => {
    startTransition(async () => {
      optimisticUpdate(merchandiseId, "delete")
      const result = await removeItem("", merchandiseId)

      if (result) {
        setMessage(result)
      } else {
        setMessage(t("removed"))
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleRemoveItem()
      }}
    >
      <button
        type="submit"
        aria-label={t("remove")}
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
        disabled={isPending}
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}

