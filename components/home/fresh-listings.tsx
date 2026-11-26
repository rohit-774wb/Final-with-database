"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, MapPinned } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ListingCard, ListingGridSkeleton } from "@/components/listing-card"
import { EmptyState } from "@/components/empty-state"
import { getApprovedListings } from "@/services/listingService"
import type { Listing } from "@/lib/types"

export function FreshListings() {
  const [latest, setLatest] = useState<Listing[] | null>(null)

  useEffect(() => {
    let active = true
    getApprovedListings({ sort: "newest" })
      .then((list) => active && setLatest(list.slice(0, 3)))
      .catch(() => active && setLatest([]))
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="container-page py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Just listed</p>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Fresh near campus</h2>
        </div>
        <Link href="/listings" className={buttonVariants({ variant: "outline" })}>
          View all <ArrowRight />
        </Link>
      </div>
      {latest === null ? (
        <ListingGridSkeleton count={3} />
      ) : latest.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No listings yet"
          description="New places show up here as soon as they're approved."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </section>
  )
}
