import { Hero } from "@/components/home/hero"
import { CategoryTiles, HowItWorks, OwnerCta, WhyNoBrokers } from "@/components/home/sections"
import { FreshListings } from "@/components/home/fresh-listings"

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <HowItWorks />
      <WhyNoBrokers />
      <FreshListings />
      <OwnerCta />
    </>
  )
}
