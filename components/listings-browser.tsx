"use client"

import { useEffect, useState } from "react"
import { SearchX, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ListingCard, ListingGridSkeleton } from "@/components/listing-card"
import { EmptyState } from "@/components/empty-state"
import { CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"
import { getApprovedListings, type ListingFilters } from "@/services/listingService"
import type { Category, Listing } from "@/lib/types"

export function ListingsBrowser({
  initialCategory,
  initialQuery,
}: {
  initialCategory?: Category
  initialQuery: string
}) {
  const [category, setCategory] = useState<Category | undefined>(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<NonNullable<ListingFilters["sort"]>>("newest")
  const [listings, setListings] = useState<Listing[] | null>(null)

  useEffect(() => {
    let active = true
    setListings(null)
    const t = setTimeout(() => {
      getApprovedListings({ category, q: query, sort })
        .then((list) => active && setListings(list))
        .catch(() => active && setListings([]))
    }, 200)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [category, query, sort])

  const chips: { value: Category | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    ...CATEGORIES.map((c) => ({ value: c.value, label: c.plural })),
  ]

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Browse near campus</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every listing is posted by the owner. No brokers.</p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={category === c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition",
                category === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area or name"
              aria-label="Search area or name"
              className="h-10 w-full rounded-xl border bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort listings"
            className="h-10 rounded-xl border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        {listings === null ? (
          <ListingGridSkeleton />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nothing matches yet"
            description="Try a different area or clear your filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setCategory(undefined)
                  setQuery("")
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
