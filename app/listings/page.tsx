import type { Metadata } from "next"
import { ListingsBrowser } from "@/components/listings-browser"
import { isCategory } from "@/lib/categories"

export const metadata: Metadata = {
  title: "Browse listings — Campus Helper",
  description: "PGs, tiffin services and second-hand books near campus, straight from owners.",
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams
  return (
    <ListingsBrowser
      key={`${category ?? ""}|${q ?? ""}`}
      initialCategory={isCategory(category) ? category : undefined}
      initialQuery={q ?? ""}
    />
  )
}
