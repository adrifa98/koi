"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the state interface
export interface ProductState {
  [key: string]: string
}

// Define the context interface
export interface ProductContextValue {
  state: ProductState
  updateOption: (option: string, value: string) => void
}

// Create context with initial value
const ProductContext = createContext<ProductContextValue>({
  state: {},
  updateOption: () => undefined,
})

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProductState>({})

  const updateOption = (option: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  const value = {
    state,
    updateOption,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProduct() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider")
  }

  return context
}

