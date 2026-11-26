"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2, HandCoins, Search, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category>("pg")

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ category })
    const q = query.trim()
    if (q) params.set("q", q)
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="size-3.5 text-highlight" />
            Made for students · 0% brokerage
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            {"Room, meals & books — "}
            <span className="text-highlight">sorted near campus.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Find PGs, tiffin services and second-hand books around your college and talk to the
            owner directly. No brokers in between.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-2 rounded-2xl bg-card p-2 text-foreground shadow-glow sm:flex-row sm:items-center"
          >
            <div className="flex gap-1 rounded-xl bg-muted p-1" role="tablist" aria-label="Category">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  role="tab"
                  aria-selected={category === c.value}
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition sm:flex-none",
                    category === c.value ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Area, e.g. Kamla Nagar"
                aria-label="Search area or name"
                className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" size="lg" className="h-11">
              Search <ArrowRight />
            </Button>
          </form>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
            {["Verified listings", "Direct WhatsApp", "Student reviews"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-highlight" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto hidden h-[420px] w-full max-w-md sm:block" aria-hidden>
          <div className="absolute right-0 top-0 w-64 rotate-3 overflow-hidden rounded-2xl bg-card text-foreground shadow-glow">
            <img src="https://picsum.photos/seed/pg-sunrise-1/600/400" alt="" className="h-36 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-bold text-primary">₹9,500/month</p>
              <p className="text-sm font-semibold">Girls PG · Kamla Nagar</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-star text-star" /> 4.5 · 0.6 km from campus
              </p>
            </div>
          </div>
          <div className="animate-float absolute bottom-6 left-0 w-60 -rotate-3 overflow-hidden rounded-2xl bg-card text-foreground shadow-glow">
            <img src="https://picsum.photos/seed/tiffin-maa-1/600/400" alt="" className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-bold text-primary">₹3,200/month</p>
              <p className="text-sm font-semibold">Homemade veg tiffin</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-6 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-foreground shadow-glow">
            <span className="flex size-10 items-center justify-center rounded-full bg-success-soft text-success">
              <HandCoins className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Brokerage paid</p>
              <p className="text-lg font-extrabold">₹0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
