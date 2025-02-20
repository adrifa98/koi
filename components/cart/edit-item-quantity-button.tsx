"use client"

import { updateItemQuantity } from "@/components/cart/actions"
import type { CartItem } from "@/lib/shopify/types"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"

function SubmitButton({
  type,
  isPending,
  t,
}: {
  type: "plus" | "minus"
  isPending: boolean
  t: (key: string) => string
}) {
  return (
    <button
      type="submit"
      aria-label={t(`quantity.${type === "plus" ? "increase" : "decrease"}`)}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
          "opacity-50 cursor-not-allowed": isPending,
        },
      )}
      disabled={isPending}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  )
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem
  type: "plus" | "minus"
  optimisticUpdate: any
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("cart")

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  }

  const handleUpdateQuantity = async () => {
    startTransition(async () => {
      optimisticUpdate(payload.merchandiseId, type)
      const result = await updateItemQuantity("", payload)

      if (result) {
        setMessage(result)
      } else {
        setMessage(t("quantity.updated"))
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleUpdateQuantity()
      }}
    >
      <SubmitButton type={type} isPending={isPending} t={t} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}

