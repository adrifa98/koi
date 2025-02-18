import { BlogContent } from "@/components/blog/blog-content"
import { Skeleton } from "@/components/ui/skeleton"
import { getBlogPosts } from "@/lib/blog"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

interface BlogPageProps {
  params: {
    locale: string
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const posts = await getBlogPosts()
  const t = await getTranslations("blog")

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<Skeleton className="h-[800px]" />}>
        <BlogContent initialPosts={posts} />
      </Suspense>
    </div>
  )
}

