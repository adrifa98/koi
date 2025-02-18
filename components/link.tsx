"use client"

import type React from "react"

import { useNavigation } from "@/lib/navigation-context"
import type { LinkProps as NextLinkProps } from "next/link"
import NextLink from "next/link"

interface LinkProps extends NextLinkProps {
  children: React.ReactNode
  className?: string
}

export function Link({ children, ...props }: LinkProps) {
  const { startNavigation } = useNavigation()

  return (
    <NextLink
      {...props}
      onClick={(e) => {
        startNavigation()
        props.onClick?.(e)
      }}
    >
      {children}
    </NextLink>
  )
}

