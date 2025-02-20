import { SearchSkeleton } from "@/components/layout/search/loading"
import { SearchForm } from "@/components/layout/search/search-form"
import { SearchSidebar } from "@/components/layout/search/search-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCollections } from "@/lib/shopify"
import { getTranslations } from "next-intl/server"
import type { ReactNode } from "react"
import { Suspense } from "react"

export default async function SearchLayout({ children }: { children: ReactNode }) {
  const collections = await getCollections()
  const t = await getTranslations("search")

  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SidebarProvider>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <Sidebar>
            <SidebarHeader className="border-b border-border/50 p-4">
              <SearchForm />
            </SidebarHeader>
            <SidebarContent className="p-4">
              <SearchSidebar collections={collections} sortTitle={t("sort.title")} />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-16 items-center gap-4 border-b px-6">
              <SidebarTrigger />
            </header>
            <div className="p-6">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Suspense>
  )
}

