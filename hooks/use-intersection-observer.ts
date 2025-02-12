"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0px",
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  const callback = useCallback(([entry]: IntersectionObserverEntry[]) => {
    setIsIntersecting(entry.isIntersecting)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold,
      root,
      rootMargin,
    })

    const currentTarget = targetRef.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [callback, root, rootMargin, threshold])

  return { targetRef, isIntersecting }
}

