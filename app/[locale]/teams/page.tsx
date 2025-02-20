import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { getCategories } from "@/lib/sanity/queries"
import Image from "next/image"

export default async function TeamsPage() {
  const categories = await getCategories()

  return (
    <div className="container py-12">

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link key={category._id} href={`/teams/${category.slug.current}`} className="block">
            <Card className="relative group overflow-hidden">
              <div className="aspect-[16/9] relative">
                {/* Background Image */}
                <Image
                  src={category.image?.asset?.url || "/placeholder.svg"}
                  alt={category.name.en}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{category.name.en}</h2>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

