import { getSupabase } from "@/lib/supabase"
import type { Review } from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReview(r: any): Review {
  return {
    id: r.id,
    listingId: r.listing_id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    comment: r.comment,
    createdAt: new Date(r.created_at).getTime(),
  }
}

export async function getReviews(listingId: string): Promise<Review[]> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toReview)
}

export async function getAverageRating(listingId: string): Promise<{ average: number; count: number }> {
  const reviews = await getReviews(listingId)
  if (reviews.length === 0) return { average: 0, count: 0 }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return { average: Math.round((total / reviews.length) * 10) / 10, count: reviews.length }
}

export async function addReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const rating = Math.round(review.rating)
  const comment = review.comment.trim()
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5.")
  if (comment.length < 3) throw new Error("Please write a short comment.")
  if (comment.length > 500) throw new Error("Comment must be under 500 characters.")

  const { data, error } = await getSupabase()
    .from("reviews")
    .insert({ listing_id: review.listingId, user_name: review.userName, rating, comment })
    .select()
    .single()
  if (error) {
    if (error.code === "23505") throw new Error("You've already reviewed this listing.")
    throw new Error(error.message)
  }
  return toReview(data)
}
