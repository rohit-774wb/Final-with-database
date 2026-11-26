import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  HandCoins,
  MessageCircle,
  PhoneOff,
  Search,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    icon: Search,
    title: "Search near campus",
    text: "Pick PG, tiffin or books and filter by area, budget and what matters to you.",
  },
  {
    icon: Star,
    title: "Check photos & reviews",
    text: "See real photos, the exact spot on the map and honest ratings from other students.",
  },
  {
    icon: MessageCircle,
    title: "Chat with the owner",
    text: "Tap WhatsApp to talk to the owner directly. Visit, decide, move in. That's it.",
  },
]

const BROKER_POINTS = [
  "One month's rent as brokerage",
  "Hidden 'service' and 'visit' charges",
  "Pushy calls and fake 'last room' pressure",
  "You never meet the real owner first",
]

const US_POINTS = [
  "₹0 commission — ever",
  "Owner's own number, on WhatsApp",
  "Every listing checked by our team",
  "Reviews from students who actually stayed",
]

export function CategoryTiles() {
  return (
    <section className="container-page relative z-10 -mt-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.value}
              href={`/listings?category=${c.value}`}
              className={cn(
                "card-surface group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift",
                c.tile,
              )}
            >
              <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", c.badge)}>
                <Icon className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.plural}</p>
                <p className="text-xs text-muted-foreground">Browse near campus</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Three steps. No middlemen.</h2>
      </div>
      <div className="relative mt-12">
        <div
          className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 md:block"
          aria-hidden
        />
        <ol className="relative grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <li key={step.title} className="relative text-center">
                <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                  <Icon className="size-7" />
                  <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-2 border-background bg-highlight text-xs font-extrabold text-highlight-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{step.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export function WhyNoBrokers() {
  return (
    <section className="bg-primary-deep py-16 text-primary-foreground sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-highlight">Why no brokers</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            {"A broker takes a month's rent. We take nothing."}
          </h2>
          <p className="mt-4 max-w-lg text-primary-foreground/75">
            For a ₹9,500 PG, a typical broker charges ₹9,500 just to show you the room. On Campus
            Helper you message the owner yourself — that money stays in your pocket for books, food
            and fees.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: HandCoins, value: "₹0", label: "Commission" },
              { icon: ShieldCheck, value: "100%", label: "Listings checked" },
              { icon: PhoneOff, value: "0", label: "Spam calls" },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3 sm:p-4">
                  <Icon className="size-5 text-highlight" />
                  <p className="mt-2 text-xl font-extrabold sm:text-2xl">{s.value}</p>
                  <p className="text-xs text-primary-foreground/70">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
            <p className="flex items-center gap-2 font-bold">
              <PhoneOff className="size-4 text-primary-foreground/60" /> With a broker
            </p>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              {BROKER_POINTS.map((p) => (
                <li key={p} className="flex gap-2">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-5 text-foreground shadow-glow">
            <p className="flex items-center gap-2 font-bold">
              <BadgeCheck className="size-4 text-primary" /> With Campus Helper
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {US_POINTS.map((p) => (
                <li key={p} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function OwnerCta() {
  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-2xl bg-hero p-6 text-primary-foreground sm:p-10">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Own a PG, run a mess or selling books?</h2>
            <p className="mt-2 text-primary-foreground/80">List it free and get messages from students directly.</p>
          </div>
          <Link
            href="/listings"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-highlight px-5 font-semibold text-highlight-foreground hover:bg-highlight/90",
            )}
          >
            Post a free listing <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
