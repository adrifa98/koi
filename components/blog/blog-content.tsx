"use client"

import { BlogCard } from "@/components/blog/blog-card"
import { BlogCategories } from "@/components/blog/blog-categories"
import { BlogGrid } from "@/components/blog/blog-grid"
import { Input } from "@/components/ui/input"
import type { BlogPost } from "@/types/blog"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface BlogContentProps {
  initialPosts: BlogPost[]
}

export function BlogContent({ initialPosts }: BlogContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const t = useTranslations()
  const postsPerPage = 9

  const categories = Array.from(
    new Set(
      initialPosts
        .flatMap((post) => post.categories || [])
        .map((category) =>
          JSON.stringify({ id: category._id, name: category.name, slug: category.slug, image: category.image }),
        ),
    ),
  ).map((cat) => JSON.parse(cat))

  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch = searchQuery
      ? post.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.en.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesCategory = selectedCategory
      ? post.categories?.some((cat) => cat.slug.current === selectedCategory)
      : true

    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil((filteredPosts.length - 2) / postsPerPage)
  const featuredPosts = filteredPosts.slice(0, 2)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(2).slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className="container space-y-8 px-4 py-8 md:px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {featuredPosts.map((post) => (
          <BlogCard key={post._id} post={post} featured />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("blog.search")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={(category) => {
              setSelectedCategory(category)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <BlogGrid posts={currentPosts} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

