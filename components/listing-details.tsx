"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, MapPin, MapPinOff, MessageCircle, UserRound } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { formatPrice } from "@/components/listing-card"
import { ReviewsSection } from "@/components/reviews-section"
import { getCategory } from "@/lib/categories"
import { cn } from "@/lib/utils"
import { getListingById } from "@/services/listingService"
import type { Listing } from "@/lib/types"

export function ListingDetails({ id }: { id: string }) {
  const [listing, setListing] = useState<Listing | null | undefined>(undefined)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let active = true
    getListingById(id)
      .then((l) => active && setListing(l))
      .catch(() => active && setListing(null))
    return () => {
      active = false
    }
  }, [id])

  if (listing === undefined) return <DetailsSkeleton />

  if (listing === null) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={MapPinOff}
          title="Listing not found"
          description="It may have been removed by the owner."
          action={
            <Link href="/listings" className={buttonVariants({ variant: "outline" })}>
              Back to listings
            </Link>
          }
        />
      </div>
    )
  }

  const cat = getCategory(listing.category)
  const waText = encodeURIComponent(`Hi ${listing.ownerName}, I saw "${listing.title}" on Campus Helper.`)

  return (
    <div className="container-page py-6 sm:py-10">
      <Link
        href="/listings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All listings
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img
              src={listing.images[activeImage] || "/placeholder.svg"}
              alt={`${listing.title} photo ${activeImage + 1}`}
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {listing.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={cn(
                    "shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition",
                    activeImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={src} alt="" className="h-16 w-24 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="card-surface h-fit p-5 sm:p-6 lg:sticky lg:top-20">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", cat.badge)}>{cat.label}</span>
          <h1 className="mt-3 text-2xl font-extrabold text-balance">{listing.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {listing.area}
          </p>
          <p className="mt-4 text-3xl font-extrabold text-primary">
            {formatPrice(listing.price)}
            <span className="text-sm font-medium text-muted-foreground">{cat.unit}</span>
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted p-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-card">
              <UserRound className="size-4" />
            </span>
            <div className="text-sm">
              <p className="font-semibold">{listing.ownerName}</p>
              <p className="text-xs text-muted-foreground">Owner · direct contact</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${listing.ownerPhone}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-4 h-11 w-full bg-success text-white hover:bg-success/90",
            )}
          >
            <MessageCircle /> Chat on WhatsApp
          </a>
          {listing.lat != null && listing.lng != null && (
          <a
            href={`https://www.google.com/maps?q=${listing.lat},${listing.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-2 h-11 w-full")}
          >
            <MapPin /> Open in Maps
          </a>
          )}
        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold">About this place</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{listing.description}</p>
          </section>
          {Object.keys(listing.details).length > 0 && (
            <section>
              <h2 className="text-lg font-bold">Details</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(listing.details).map(([k, v]) => (
                  <div key={k} className="rounded-xl border bg-card p-3">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <ReviewsSection listingId={listing.id} />
        </div>
      </div>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-label="Loading listing">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="aspect-[3/2] animate-pulse rounded-2xl bg-muted" />
        <div className="card-surface space-y-3 p-6">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-9 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}
