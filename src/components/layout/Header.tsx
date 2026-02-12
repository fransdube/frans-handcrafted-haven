import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/SearchBar'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
           <Image src="/assets/logo.png" alt="Handcrafted Haven" width={150} height={40} className="h-10 w-auto object-contain" />
        </Link>

        {/* Categories / Navigation (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2">
            <Link href="/products">
              <Button variant="ghost">Categories</Button>
            </Link>
            <Link href="/products?tag=outlet">
              <Button variant="ghost">Outlet</Button>
            </Link>
            <Link href="/products?sort=popular">
              <Button variant="ghost">Most Sold</Button>
            </Link>
        </div>

        {/* Search Bar */}
        <Suspense fallback={
            <div className="flex-1 max-w-xl relative hidden sm:block">
                <Input placeholder="Search for anything..." className="pl-10 rounded-full bg-stone-50 border-stone-300" disabled />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            </div>
        }>
            <SearchBar />
        </Suspense>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
             <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {/* Notification dot */}
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
             </Button>
          </Link>

          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
                <User className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/dashboard/seller">
             <Button variant="outline" size="sm" className="hidden md:inline-flex">Sell</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
