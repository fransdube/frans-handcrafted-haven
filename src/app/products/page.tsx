import { ProductCard } from "@/components/ProductCard"
import { ProductFilters } from "@/components/ProductFilters"
import { prisma } from "@/lib/prisma"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { search, category, price, tag, sort } = await searchParams

  const where: any = {}

  if (search) {
      const term = Array.isArray(search) ? search[0] : search
      if (term) {
        where.OR = [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
        ]
      }
  }

  if (category) {
      const categories = Array.isArray(category) ? category : [category]
      // Only filter if categories are valid strings
      const validCategories = categories.filter(c => typeof c === 'string')
      if (validCategories.length > 0) {
          where.category = { in: validCategories }
      }
  }

  if (tag === 'outlet') {
      // Mock logic for "Outlet": items under $50
      if (!where.price) where.price = {}
      where.price.lte = 50
  }

  if (price && typeof price === 'string') {
      const [min, max] = price.split('-').map(Number)
      if (!isNaN(min) && !isNaN(max)) {
          if (!where.price) where.price = {}
          where.price.gte = min
          where.price.lte = max
      }
  }

  const orderBy: any = {}
  if (sort === 'popular') {
      orderBy.price = 'desc' // Placeholder for popularity
  } else if (sort === 'price_asc') {
      orderBy.price = 'asc'
  } else if (sort === 'price_desc') {
      orderBy.price = 'desc'
  } else {
      orderBy.createdAt = 'desc'
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      seller: true,
      images: true,
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8">All Products</h1>

       <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <ProductFilters />

          {/* Product Grid */}
          <div className="flex-1">
             {products.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                       <ProductCard
                         key={p.id}
                         id={p.id}
                         title={p.title}
                         price={p.price}
                         seller={p.seller.name || "Unknown"}
                         image={p.images[0]?.url || "https://placehold.co/400x400?text=No+Image"}
                       />
                    ))}
                 </div>
             ) : (
                 <div className="text-center py-12">
                     <p className="text-stone-500 text-lg">No products found matching your criteria.</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  )
}
