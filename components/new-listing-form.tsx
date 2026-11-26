"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/toast-provider"
import { CATEGORIES } from "@/lib/categories"
import { createListing } from "@/services/listingService"
import { MAX_IMAGES, uploadListingImage } from "@/services/imageService"
import type { Category } from "@/lib/types"

const input =
  "mt-1 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"

export function NewListingForm() {
  const { user, loading } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [f, setF] = useState({ title: "", category: "pg" as Category, price: "", area: "", description: "", phone: "", lat: "", lng: "" })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  if (loading) return <div className="container-page py-16 text-muted-foreground">Loading...</div>
  if (!user)
    return (
      <div className="container-page py-16">
        <p className="mb-4">Please sign in to post a listing.</p>
        <Link href="/login" className={buttonVariants()}>Sign in</Link>
      </div>
    )

  function addFiles(list: FileList | null) {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, MAX_IMAGES))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setBusy(true)
    try {
      const images = await Promise.all(files.map((file) => uploadListingImage(file, user.id)))
      await createListing({
        title: f.title.trim(),
        category: f.category,
        price: Number(f.price),
        area: f.area.trim(),
        description: f.description.trim(),
        images,
        ownerName: user.name,
        ownerPhone: (f.phone || user.phone).replace(/\D/g, ""),
        lat: f.lat ? Number(f.lat) : null,
        lng: f.lng ? Number(f.lng) : null,
      })
      toast("Submitted! It will go live once an admin approves it.")
      router.push("/listings")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't submit listing.", "error")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-2xl font-extrabold">Post a listing</h1>
      <form onSubmit={submit} className="card-surface mt-5 space-y-4 p-5 sm:p-6">
        <label className="block text-sm font-semibold">
          Title
          <input required minLength={3} maxLength={120} value={f.title} onChange={set("title")} className={`${input} h-10`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold">
            Category
            <select value={f.category} onChange={set("category")} className={`${input} h-10`}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Price (₹)
            <input required type="number" min={0} value={f.price} onChange={set("price")} className={`${input} h-10`} />
          </label>
          <label className="block text-sm font-semibold">
            Area
            <input required value={f.area} onChange={set("area")} className={`${input} h-10`} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Description
          <textarea required rows={4} value={f.description} onChange={set("description")} className={`${input} p-3`} />
        </label>
        <label className="block text-sm font-semibold">
          WhatsApp number (country code, digits only)
          <input inputMode="tel" placeholder={user.phone || "919876543210"} value={f.phone} onChange={set("phone")} className={`${input} h-10`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Latitude (optional)
            <input type="number" step="any" value={f.lat} onChange={set("lat")} className={`${input} h-10`} />
          </label>
          <label className="block text-sm font-semibold">
            Longitude (optional)
            <input type="number" step="any" value={f.lng} onChange={set("lng")} className={`${input} h-10`} />
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold">Photos (up to {MAX_IMAGES}, JPG/PNG/WebP, 5 MB each)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt="" className="h-20 w-28 rounded-lg object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                  className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-foreground text-background"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {files.length < MAX_IMAGES && (
              <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-muted">
                <ImagePlus className="size-5" /> Add
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = "" }} />
              </label>
            )}
          </div>
        </div>

        <Button type="submit" size="lg" disabled={busy} className="h-10 px-5">
          {busy ? "Uploading..." : "Submit for approval"}
        </Button>
      </form>
    </div>
  )
}
