"use client"

import { useCallback, useEffect, useRef } from "react"

interface DebouncedFunction<T extends (...args: any[]) => any> extends Function {
  cancel?: () => void
}

export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): DebouncedFunction<T> {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  ) as DebouncedFunction<T>

  debouncedFunction.cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return debouncedFunction
}

