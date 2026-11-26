"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Check, Trash2, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { formatPrice } from "@/components/listing-card"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/toast-provider"
import { cn } from "@/lib/utils"
import { deleteListing, getListingsByStatus, setListingStatus } from "@/services/listingService"
import { ShieldCheck } from "lucide-react"
import type { Listing, ListingStatus } from "@/lib/types"

const TABS: ListingStatus[] = ["pending", "approved", "rejected"]

export function AdminPanel() {
  const { user, loading, isAdmin } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState<ListingStatus>("pending")
  const [items, setItems] = useState<Listing[] | null>(null)

  const load = useCallback(async () => {
    setItems(null)
    try {
      setItems(await getListingsByStatus(tab))
    } catch (err) {
      setItems([])
      toast(err instanceof Error ? err.message : "Couldn't load listings.", "error")
    }
  }, [tab, toast])

  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin, load])

  if (loading) return <div className="container-page py-16 text-muted-foreground">Loading...</div>
  if (!user || !isAdmin)
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShieldCheck}
          title="Admins only"
          description="Sign in with an admin account to moderate listings."
          action={<Link href="/login" className={buttonVariants({ variant: "outline" })}>Sign in</Link>}
        />
      </div>
    )

  async function act(id: string, fn: () => Promise<void>, msg: string) {
    try {
      await fn()
      toast(msg)
      await load()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Action failed.", "error")
    }
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold">Admin — moderate listings</h1>
      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize",
              tab === t ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {items === null ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Nothing in “{tab}”.</p>
        ) : (
          items.map((l) => (
            <div key={l.id} className="card-surface flex flex-wrap items-center gap-4 p-4">
              <img src={l.images[0] || "/placeholder.svg"} alt="" className="h-16 w-24 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <Link href={`/listings/${l.id}`} className="font-semibold hover:underline">{l.title}</Link>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(l.price)} · {l.area} · by {l.ownerName}
                </p>
              </div>
              <div className="flex gap-2">
                {tab !== "approved" && (
                  <Button onClick={() => act(l.id, () => setListingStatus(l.id, "approved"), "Approved.")}>
                    <Check /> Approve
                  </Button>
                )}
                {tab !== "rejected" && (
                  <Button variant="outline" onClick={() => act(l.id, () => setListingStatus(l.id, "rejected"), "Rejected.")}>
                    <X /> Reject
                  </Button>
                )}
                <Button
                  variant="destructive"
                  aria-label="Delete listing"
                  onClick={() => confirm("Delete this listing permanently?") && act(l.id, () => deleteListing(l.id), "Deleted.")}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
