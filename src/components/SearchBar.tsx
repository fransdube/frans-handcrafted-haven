"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("search") || ""
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/products")
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
       <Input
         placeholder="Search for anything..."
         className="pl-10 rounded-full bg-stone-50 border-stone-300"
         value={query}
         onChange={(e) => setQuery(e.target.value)}
       />
       <Button type="submit" variant="ghost" size="icon" className="absolute left-0 top-0 h-full w-10 hover:bg-transparent">
          <Search className="h-4 w-4 text-stone-500" />
       </Button>
    </form>
  )
}
