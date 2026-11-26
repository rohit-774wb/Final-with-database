import Link from "next/link"
import { MapPin } from "lucide-react"
import { getCategory } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Listing } from "@/lib/types"

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

export function ListingCard({ listing }: { listing: Listing }) {
  const cat = getCategory(listing.category)
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card-surface group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={listing.images[0] || "/placeholder.svg"}
          alt={listing.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur", cat.badge, "bg-card/90")}>
          {cat.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-bold text-primary">
          {formatPrice(listing.price)}
          <span className="text-xs font-medium text-muted-foreground">{cat.unit}</span>
        </p>
        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {listing.area}
        </p>
      </div>
    </Link>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading listings">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface overflow-hidden">
          <div className="aspect-[3/2] animate-pulse bg-muted" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
