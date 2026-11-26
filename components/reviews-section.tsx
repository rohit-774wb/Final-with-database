"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { MessageSquareText, Star } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/components/toast-provider"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { addReview, getAverageRating, getReviews } from "@/services/reviewService"
import type { Review } from "@/lib/types"

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("size-4", n <= Math.round(value) ? "fill-star text-star" : "text-muted-foreground/40")}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function ReviewsSection({ listingId }: { listingId: string }) {
  const { user } = useAuth()
  const toast = useToast()
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [summary, setSummary] = useState<{ average: number; count: number }>({ average: 0, count: 0 })
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    const [list, avg] = await Promise.all([getReviews(listingId), getAverageRating(listingId)])
    setReviews(list)
    setSummary(avg)
  }, [listingId])

  useEffect(() => {
    load().catch(() => setReviews([]))
  }, [load])

  const alreadyReviewed = !!user && !!reviews?.some((r) => r.userId === user.id)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (rating === 0) {
      toast("Pick a star rating first.", "error")
      return
    }
    setSubmitting(true)
    try {
      await addReview({ listingId, userId: user.id, userName: user.name, rating, comment })
      setRating(0)
      setComment("")
      await load()
      toast("Thanks! Your review is live.")
    } catch (err) {
      toast(err instanceof Error ? err.message : "Couldn't post your review.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="reviews-heading" className="text-lg font-bold">
          Student reviews
        </h2>
        {summary.count > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold">{summary.average.toFixed(1)}</span>
            <div>
              <Stars value={summary.average} />
              <p className="text-xs text-muted-foreground">
                {summary.count} review{summary.count === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="card-surface mt-4 p-4 sm:p-5">
        {!user ? (
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">Sign in to share your experience with other students.</p>
            <Link href="/login" className={buttonVariants({ variant: "outline" })}>
              Sign in to review
            </Link>
          </div>
        ) : alreadyReviewed ? (
          <p className="text-sm text-muted-foreground">
            {"You've already reviewed this listing. Thanks for helping other students!"}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <fieldset>
              <legend className="text-sm font-semibold">Your rating</legend>
              <div className="mt-1 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    aria-pressed={rating === n}
                    className="cursor-pointer rounded p-0.5"
                  >
                    <Star
                      className={cn(
                        "size-6 transition",
                        n <= (hover || rating) ? "fill-star text-star" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="review-comment" className="text-sm font-semibold">
                Your review
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                required
                placeholder="What was it like? Food, cleanliness, owner, location..."
                className="mt-1 w-full resize-y rounded-xl border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="h-10 px-4">
              {submitting ? "Posting..." : "Post review"}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-4">
        {reviews === null ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading reviews">
            {[0, 1].map((i) => (
              <div key={i} className="card-surface space-y-2 p-4">
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews yet"
            description="Be the first student to review this place."
          />
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="card-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {r.userName.charAt(0)}
                    </span>
                    <span className="font-semibold">{r.userName}</span>
                  </div>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                <p className="mt-2 text-xs text-muted-foreground/80">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
