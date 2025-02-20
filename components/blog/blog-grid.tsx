import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/blog"
import { useTranslations } from "next-intl"

interface BlogGridProps {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function BlogGrid({ posts, currentPage, totalPages, onPageChange }: BlogGridProps) {
  const t = useTranslations("blog")

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:hidden">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>

      <div className="hidden sm:grid gap-6 lg:grid-cols-3">
        <div className="relative col-span-2 grid gap-4 sm:grid-cols-2">
          {posts.slice(0, Math.ceil((posts.length * 2) / 3)).map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
        <div className="relative space-y-4">
          {posts.slice(Math.ceil((posts.length * 2) / 3)).map((post) => (
            <BlogCard key={post._id} post={post} horizontal />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {t("navigation.previous")}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t("navigation.next")}
          </Button>
        </div>
      )}
    </div>
  )
}

