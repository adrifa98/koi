import { BlogPostNavigation } from "@/components/blog/blog-post-navigation"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getBlogPost } from "@/lib/blog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

interface BlogPostPageProps {
  params: {
    id: string
    locale: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.id)
  const t = await getTranslations("blog")
  const tPost = await getTranslations("blog.post")

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("postNotFound")}</h1>
          <Link href={`/${params.locale}/blog`}>
            <Button variant="link" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToBlog")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative aspect-[21/9] max-h-[500px] w-full overflow-hidden">
          <Image
            src={post.mainImage.asset.url || "/placeholder.svg"}
            alt={post.mainImage.alt || tPost("title", { title: post.title.en })}
            fill
            className="object-cover"
            priority
            style={{ viewTransitionName: `post-image-${post._id}` }}
          />
        </div>
      </div>

      <div className="container max-w-4xl py-12">
        <div className="mb-8 flex items-center gap-4">
          <BlogPostNavigation />
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <div
                  key={category._id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {tPost("category", { category: category.name.en })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">{tPost("title", { title: post.title.en })}</h1>
          {post.subtitle && (
            <p className="text-xl text-muted-foreground">{tPost("subtitle", { subtitle: post.subtitle.en })}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t("readTime", { minutes: post.readingTime })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {t("publishedAt", {
                  date: format(new Date(post.publishedAt), "dd MMM yyyy", {
                    locale: params.locale === "es" ? es : undefined,
                  }),
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-primary max-w-none">
          {tPost("content", { content: post.content.en })
            .split("\n")
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>
    </article>
  )
}

