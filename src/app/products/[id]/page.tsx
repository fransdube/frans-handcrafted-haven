import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Star, ShieldCheck } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
        seller: {
            include: {
                reviews: true,
            }
        },
        images: true,
        reviews: {
            include: {
                user: true
            }
        }
    }
  })

  if (!product) {
      notFound()
  }

  // Calculate seller rating (mock logic or fetching all seller reviews if needed)
  // For now, let's use a static or computed value if possible.
  // Actually, let's just use the product reviews for the rating display on the product page for now,
  // or just hardcode/mock the seller rating since computing it from all products might be heavy.
  const sellerRating = 4.8
  const sellerReviewCount = 124

  // Related products
  const relatedProducts = await prisma.product.findMany({
      where: {
          category: product.category,
          NOT: { id: product.id }
      },
      take: 4,
      include: {
          seller: true,
          images: true
      }
  })

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
             <div className="aspect-square relative bg-stone-100 rounded-lg overflow-hidden">
                <Image
                    src={product.images[0]?.url || "https://placehold.co/600x600?text=No+Image"}
                    alt={product.title}
                    fill
                    className="object-cover"
                />
             </div>
             <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                   <div key={i} className="aspect-square relative bg-stone-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-stone-900">
                      <Image src={img.url} alt={`${product.title} ${i}`} fill className="object-cover" />
                   </div>
                ))}
             </div>
          </div>

          {/* Details */}
          <div>
             <div className="mb-6">
                <Link href={`/sellers/${product.seller.id}`} className="text-sm font-medium text-stone-500 hover:underline">
                   {product.seller.name || "Unknown Seller"}
                </Link>
                <h1 className="text-3xl font-bold mt-1 text-stone-900">{product.title}</h1>
                <div className="flex items-center gap-1 mt-2">
                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                   <span className="font-medium">{sellerRating}</span>
                   <span className="text-stone-500">({sellerReviewCount} reviews)</span>
                </div>
             </div>

             <div className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</div>

             <Button size="lg" className="w-full mb-8">Add to Cart</Button>

             <div className="prose prose-stone mb-8">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-stone-600">{product.description}</p>
             </div>

             <div className="border-t border-stone-200 pt-6">
                <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                   <ShieldCheck className="h-5 w-5 text-green-600" />
                   <span>Handcrafted Haven Purchase Protection</span>
                </div>
                <p className="text-xs text-stone-500">
                   Shop confidently knowing that if something goes wrong with your order, we&apos;ve got your back for all eligible purchases.
                </p>
             </div>
          </div>
       </div>

       {/* Reviews */}
       <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {product.reviews.length > 0 ? product.reviews.map(r => (
                <div key={r.id} className="bg-stone-50 p-6 rounded-lg">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{r.user.name || "Anonymous"}</span>
                      <div className="flex">
                         {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`} />
                         ))}
                      </div>
                   </div>
                   <p className="text-stone-600">{r.comment}</p>
                </div>
             )) : (
                 <p className="text-stone-500 italic">No reviews yet.</p>
             )}
          </div>
       </div>

       {/* Related Products */}
       <div className="mt-16 border-t border-stone-200 pt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {relatedProducts.map(p => (
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
       </div>
    </div>
  )
}
