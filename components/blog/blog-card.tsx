"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import type { BlogPost } from "@/types/blog"
import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type React from "react"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
  horizontal?: boolean
}

export function BlogCard({ post, featured = false, horizontal = false }: BlogCardProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("blog")
  const tPost = useTranslations("blog.post")

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (!document.startViewTransition) {
      router.push(`/${locale}/blog/${post._id}`)
      return
    }

    const transition = document.startViewTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      router.push(`/${locale}/blog/${post._id}`)
    })

    try {
      await transition.finished
    } catch (error) {
      router.push(`/${locale}/blog/${post._id}`)
    }
  }

  const CategoryBadge = post.categories?.[0] && (
    <div className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">
      {post.categories[0].image?.asset?.url && (
        <div className="relative h-4 w-4 overflow-hidden rounded-full">
          <Image
            src={post.categories[0].image.asset.url || "/placeholder.svg"}
            alt={tPost("category", { category: post.categories[0].name.en })}
            fill
            className="object-cover"
          />
        </div>
      )}
      <span className="font-medium">{tPost("category", { category: post.categories[0].name.en })}</span>
    </div>
  )

  const DateAndTime = (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), "MMM d, yyyy")}</time>
      <span>•</span>
      <span>{t("readTime", { minutes: post.readingTime })}</span>
    </div>
  )

  if (featured) {
    return (
      <Link href={`/${locale}/blog/${post._id}`} onClick={handleClick} className="block group">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg transition-all duration-300 hover:scale-105">
          <Image
            src={post.mainImage.asset.url || "/placeholder.svg"}
            alt={post.mainImage.alt || tPost("title", { title: post.title.en })}
            fill
            className="object-cover"
            style={{ viewTransitionName: `post-image-${post._id}` }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          {post.categories?.[0] && <div className="absolute left-4 top-4">{CategoryBadge}</div>}
          <div
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{ viewTransitionName: `post-content-${post._id}` }}
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                {tPost("title", { title: post.title.en })}
              </h3>
              {post.subtitle && (
                <p className="line-clamp-2 text-sm text-gray-200">
                  {tPost("subtitle", { subtitle: post.subtitle.en })}
                </p>
              )}
              <div className="text-gray-300">{DateAndTime}</div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/${locale}/blog/${post._id}`} onClick={handleClick} className="block group">
      <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className={horizontal ? "flex gap-4 p-4" : "space-y-2 p-0"}>
          {horizontal ? (
            <>
              <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-md sm:w-32">
                <Image
                  src={post.mainImage.asset.url || "/placeholder.svg"}
                  alt={post.mainImage.alt || tPost("title", { title: post.title.en })}
                  fill
                  className="object-cover"
                  style={{ viewTransitionName: `post-image-${post._id}` }}
                  priority
                />
              </div>
              <div className="flex-1 space-y-2" style={{ viewTransitionName: `post-content-${post._id}` }}>
                {post.categories?.[0] && CategoryBadge}
                <h3 className="line-clamp-2 font-semibold">{tPost("title", { title: post.title.en })}</h3>
                {DateAndTime}
              </div>
            </>
          ) : (
            <>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.mainImage.asset.url || "/placeholder.svg"}
                  alt={post.mainImage.alt || tPost("title", { title: post.title.en })}
                  fill
                  className="object-cover"
                  style={{ viewTransitionName: `post-image-${post._id}` }}
                  priority
                />
                {post.categories?.[0] && <div className="absolute left-4 top-4">{CategoryBadge}</div>}
              </div>
              <div className="space-y-1 p-4" style={{ viewTransitionName: `post-content-${post._id}` }}>
                <h3 className="font-semibold line-clamp-2">{tPost("title", { title: post.title.en })}</h3>
                {DateAndTime}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

