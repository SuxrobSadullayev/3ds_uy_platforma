import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeCheck,
  Building,
  CalendarDays,
  ChevronRight,
  Layers,
  MapPin,
  Maximize,
  BedDouble,
  HardHat,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PropertyMedia } from '@/components/property/property-media'
import { PropertyContactPanel } from '@/components/property/property-contact-panel'
import { PropertyCard } from '@/components/property-card'
import {
  getPropertyById,
  properties,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
} from '@/lib/data/properties'

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) return { title: 'Mulk topilmadi' }
  return {
    title: property.title,
    description: property.description,
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) notFound()

  const similar = properties
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 4)

  const specs = [
    { icon: Maximize, label: 'Maydon', value: `${property.area} m²` },
    { icon: BedDouble, label: 'Xonalar', value: `${property.rooms} xona` },
    property.floor
      ? {
          icon: Layers,
          label: 'Qavat',
          value: `${property.floor}/${property.totalFloors}`,
        }
      : null,
    property.yearBuilt
      ? { icon: CalendarDays, label: 'Qurilgan yil', value: `${property.yearBuilt}` }
      : null,
    { icon: Building, label: 'Turi', value: PROPERTY_TYPE_LABELS[property.type] },
  ].filter(Boolean) as { icon: typeof Maximize; label: string; value: string }[]

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Bosh sahifa
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link href="/mulklar" className="hover:text-foreground">
            Mulklar
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="truncate text-foreground">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <PropertyMedia property={property} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {PROPERTY_STATUS_LABELS[property.status]}
                </span>
                {property.rentToOwn && (
                  <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                    Rent-to-Own
                  </span>
                )}
                {property.seller.verified && (
                  <span className="flex items-center gap-1 text-xs font-medium text-accent">
                    <BadgeCheck className="size-4" aria-hidden="true" />
                    Tasdiqlangan sotuvchi
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground text-balance md:text-3xl">
                {property.title}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {property.address}, {property.district}, {property.region}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {specs.map((spec) => {
                const Icon = spec.icon
                return (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3"
                  >
                    <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-semibold text-card-foreground">
                      {spec.value}
                    </dd>
                  </div>
                )
              })}
            </dl>

            {property.constructionProgress !== undefined && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <HardHat className="size-4 text-primary" aria-hidden="true" />
                    Qurilish bosqichi
                  </h2>
                  <span className="text-sm font-bold text-primary">
                    {property.constructionProgress}% tayyor
                  </span>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={property.constructionProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Qurilish jarayoni"
                >
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${property.constructionProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Topshirish muddati: {property.yearBuilt}-yil
                </p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground">Tavsif</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </div>
          </div>

          <PropertyContactPanel property={property} />
        </div>

        {similar.length > 0 && (
          <section className="mt-14" aria-labelledby="similar-heading">
            <h2 id="similar-heading" className="text-xl font-bold text-foreground">
              O&apos;xshash mulklar
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
