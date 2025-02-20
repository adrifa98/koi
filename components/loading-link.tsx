"use client"

import { Link, useRouter } from "@/i18n/routing"
import type React from "react"
import { useCallback } from "react"
import { useLoading } from "./loading-provider"

interface LoadingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  locale?: string
}

export function LoadingLink({ href, children, className, onClick, ...props }: LoadingLinkProps) {
  const { startLoading } = useLoading()
  const router = useRouter()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (onClick) {
        onClick(e)
      }

      // Iniciamos el loading
      startLoading()
      console.log("Link clicked, navigating to:", href) // Debug log

      // Delay artificial para asegurar que se ve la animación
      setTimeout(() => {
        router.push(href)
      }, 500) // Aumentamos el delay para pruebas
    },
    [href, onClick, router, startLoading],
  )

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

