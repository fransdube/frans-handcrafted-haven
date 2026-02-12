"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect, Suspense } from "react"

function ProductFiltersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState("")

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setCategories(searchParams.getAll("category") || [])
    setPriceRange(searchParams.get("price") || "")
  }, [searchParams])

  const updateFilters = (newSearch: string, newCategories: string[], newPrice: string) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update search
      if (newSearch) params.set("search", newSearch)
      else params.delete("search")

      // Update categories (remove all first then add)
      params.delete("category")
      newCategories.forEach(c => params.append("category", c))

      // Update price
      if (newPrice) params.set("price", newPrice)
      else params.delete("price")

      router.push(`/products?${params.toString()}`)
  }

  const handleSearchSubmit = () => {
      updateFilters(search, categories, priceRange)
  }

  const toggleCategory = (cat: string) => {
      const newCats = categories.includes(cat)
        ? categories.filter(c => c !== cat)
        : [...categories, cat]
      // Optimistic update
      setCategories(newCats)
      updateFilters(search, newCats, priceRange)
  }

  const handlePriceChange = (range: string) => {
      setPriceRange(range)
      updateFilters(search, categories, range)
  }

  return (
      <aside className="w-full md:w-64 space-y-8">
             <div>
                <h3 className="font-semibold mb-4">Search</h3>
                <div className="relative">
                   <Input
                     placeholder="Search..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                   />
                   <Search
                     className="absolute right-3 top-2.5 h-4 w-4 text-stone-500 cursor-pointer"
                     onClick={handleSearchSubmit}
                   />
                </div>
             </div>

             <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2 text-sm text-stone-600">
                   {["Jewelry", "Home Decor", "Clothing", "Art"].map(cat => (
                       <label key={cat} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={categories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                          /> {cat}
                       </label>
                   ))}
                </div>
             </div>

             <div>
                <h3 className="font-semibold mb-4">Price</h3>
                 <div className="space-y-2 text-sm text-stone-600">
                   {[
                       { label: "Under $25", value: "0-25" },
                       { label: "$25 - $50", value: "25-50" },
                       { label: "$50 - $100", value: "50-100" },
                       { label: "Over $100", value: "100-1000000" }
                   ].map(range => (
                       <label key={range.value} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="price"
                            checked={priceRange === range.value}
                            onChange={() => handlePriceChange(range.value)}
                            className="text-stone-900 focus:ring-stone-900"
                          /> {range.label}
                       </label>
                   ))}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === ""}
                        onChange={() => handlePriceChange("")}
                        className="text-stone-900 focus:ring-stone-900"
                      /> All Prices
                   </label>
                </div>
             </div>
          </aside>
  )
}

export function ProductFilters() {
  return (
    <Suspense fallback={<div className="w-full md:w-64">Loading filters...</div>}>
      <ProductFiltersContent />
    </Suspense>
  )
}
