"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"; // Added import for React
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

