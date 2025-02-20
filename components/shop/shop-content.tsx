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
  // Seleccionar los primeros 5 productos para Featured Products
  const featuredProducts = products.slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <FeaturedGrid />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}

      {/* Category Products */}
      <div className="space-y-20 py-20">
        {categoryProducts.accesorios.length > 0 && (
          <CategoryProducts title="Accesorios" products={categoryProducts.accesorios} />
        )}
        {categoryProducts.equipacion.length > 0 && (
          <CategoryProducts title="Equipación" products={categoryProducts.equipacion} />
        )}
        {categoryProducts.lifestyle.length > 0 && (
          <CategoryProducts title="Lifestyle" products={categoryProducts.lifestyle} />
        )}
        {categoryProducts.outlet.length > 0 && <CategoryProducts title="Outlet" products={categoryProducts.outlet} />}
      </div>

      <TeamSection />
    </div>
  )
}

