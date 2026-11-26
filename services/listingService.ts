import { getSupabase } from "@/lib/supabase"
import type { Category, Listing, ListingStatus } from "@/lib/types"

export interface ListingFilters {
  category?: Category
  q?: string
  sort?: "newest" | "price-asc" | "price-desc"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListing(r: any): Listing {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    price: r.price,
    area: r.area,
    description: r.description,
    images: r.images ?? [],
    ownerId: r.owner_id,
    ownerName: r.owner_name,
    ownerPhone: r.owner_phone,
    status: r.status,
    lat: r.lat,
    lng: r.lng,
    createdAt: new Date(r.created_at).getTime(),
    details: r.details ?? {},
  }
}

export async function getApprovedListings(filters: ListingFilters = {}): Promise<Listing[]> {
  let query = getSupabase().from("listings").select("*").eq("status", "approved")
  if (filters.category) query = query.eq("category", filters.category)
  const q = filters.q?.trim().replace(/[%,()]/g, " ")
  if (q) query = query.or(`title.ilike.%${q}%,area.ilike.%${q}%`)
  if (filters.sort === "price-asc") query = query.order("price", { ascending: true })
  else if (filters.sort === "price-desc") query = query.order("price", { ascending: false })
  else query = query.order("created_at", { ascending: false })
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map(toListing)
}

/** RLS decides visibility: public sees approved, owners see their own, admins see all. */
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await getSupabase().from("listings").select("*").eq("id", id).maybeSingle()
  if (error) return null
  return data ? toListing(data) : null
}

export interface NewListingInput {
  title: string
  category: Category
  price: number
  area: string
  description: string
  images: string[]
  ownerName: string
  ownerPhone: string
  lat: number | null
  lng: number | null
}

export async function createListing(input: NewListingInput): Promise<void> {
  const { error } = await getSupabase().from("listings").insert({
    title: input.title,
    category: input.category,
    price: input.price,
    area: input.area,
    description: input.description,
    images: input.images,
    owner_name: input.ownerName,
    owner_phone: input.ownerPhone,
    lat: input.lat,
    lng: input.lng,
  })
  if (error) throw new Error(error.message)
}

// ── Admin ──
export async function getListingsByStatus(status: ListingStatus): Promise<Listing[]> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toListing)
}

export async function setListingStatus(id: string, status: ListingStatus): Promise<void> {
  const { error } = await getSupabase().from("listings").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await getSupabase().from("listings").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
