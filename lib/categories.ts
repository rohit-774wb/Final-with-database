import { BookOpen, BedDouble, UtensilsCrossed, type LucideIcon } from "lucide-react"
import type { Category } from "@/lib/types"

export const CATEGORIES: {
  value: Category
  label: string
  plural: string
  icon: LucideIcon
  tile: string
  badge: string
  unit: string
}[] = [
  {
    value: "pg",
    label: "PG",
    plural: "PGs & Hostels",
    icon: BedDouble,
    tile: "hover:border-primary/40",
    badge: "bg-primary/10 text-primary",
    unit: "/month",
  },
  {
    value: "tiffin",
    label: "Tiffin",
    plural: "Tiffin & Mess",
    icon: UtensilsCrossed,
    tile: "hover:border-highlight/60",
    badge: "bg-highlight/20 text-highlight-foreground dark:text-highlight",
    unit: "/month",
  },
  {
    value: "books",
    label: "Books",
    plural: "Second-hand Books",
    icon: BookOpen,
    tile: "hover:border-success/50",
    badge: "bg-success-soft text-success",
    unit: "",
  },
]

export function getCategory(value: Category) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0]
}

export function isCategory(value: unknown): value is Category {
  return value === "pg" || value === "tiffin" || value === "books"
}
