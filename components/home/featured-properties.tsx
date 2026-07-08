import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'
import { getFeaturedProperties } from '@/lib/data/properties'

export function FeaturedProperties() {
  const featured = getFeaturedProperties()

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Tanlangan mulklar
            </h2>
            <p className="text-muted-foreground">
              {"Eng yaxshi takliflar — 3D ko'rish va virtual tur bilan"}
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            nativeButton={false} render={<Link href="/mulklar" />}
          >
            {"Barchasini ko'rish"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
