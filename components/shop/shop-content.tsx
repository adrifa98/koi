import type { Product } from "@/lib/shopify/types"
import { CategoryProducts } from "./category-products"
import { FeaturedGrid } from "./featured-grid"
import { FeaturedProducts } from "./featured-products"
import { TeamSection } from "./team-section"

interface ShopContentProps {
  products: Product[]
  categoryProducts: {
    accesorios: Product[]
    equipacion: Product[]
    lifestyle: Product[]
    outlet: Product[]
  }
}

export function ShopContent({ products, categoryProducts }: ShopContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <FeaturedGrid />
      <FeaturedProducts products={products} />

      {/* Category Products */}
      <div className="space-y-20 py-20">
        <CategoryProducts title="Accesorios" products={categoryProducts.accesorios} />
        <CategoryProducts title="Equipación" products={categoryProducts.equipacion} />
        <CategoryProducts title="Lifestyle" products={categoryProducts.lifestyle} />
        <CategoryProducts title="Outlet" products={categoryProducts.outlet} />
      </div>

      <TeamSection />
    </div>
  )
}

