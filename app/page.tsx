import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { FeaturesSection } from '@/components/home/features-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProperties />
        <FeaturesSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
