export type Category = "pg" | "tiffin" | "books"

export type ListingStatus = "pending" | "approved" | "rejected"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "student" | "owner" | "admin"
  savedListings: string[]
}

export interface Listing {
  id: string
  title: string
  category: Category
  price: number
  area: string
  description: string
  images: string[]
  ownerId: string
  ownerName: string
  ownerPhone: string
  status: ListingStatus
  lat: number | null
  lng: number | null
  createdAt: number
  details: Record<string, string>
}

export interface Review {
  id: string
  listingId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: number
}
