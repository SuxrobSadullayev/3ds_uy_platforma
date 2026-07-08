import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, Box, Camera, MapPin, Maximize, BedDouble, Building } from 'lucide-react'
import {
  type Property,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  formatPrice,
} from '@/lib/data/properties'

export function PropertyCard({ property }: { property: Property }) {
  const isRent = property.status === 'ijaraga'
  const isAuction = property.status === 'auktsion'

  return (
    <Link
      href={`/mulklar/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image || '/placeholder.svg'}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              isAuction
                ? 'bg-destructive text-white'
                : isRent
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
            }`}
          >
            {PROPERTY_STATUS_LABELS[property.status]}
          </span>
          {property.rentToOwn && (
            <span className="rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-foreground">
              Rent-to-Own
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {property.has3D && (
            <span className="flex items-center gap-1 rounded-md bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background">
              <Box className="size-3" aria-hidden="true" />
              3D
            </span>
          )}
          {property.hasVirtualTour && (
            <span className="flex items-center gap-1 rounded-md bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background">
              <Camera className="size-3" aria-hidden="true" />
              {'360°'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building className="size-3.5" aria-hidden="true" />
          <span>{PROPERTY_TYPE_LABELS[property.type]}</span>
          {property.seller.verified && (
            <span className="flex items-center gap-0.5 text-accent">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Tasdiqlangan
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground text-pretty">
          {property.title}
        </h3>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {property.district}, {property.region}
          </span>
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Maximize className="size-3.5" aria-hidden="true" />
            {property.area} {'m²'}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="size-3.5" aria-hidden="true" />
            {property.rooms} xona
          </span>
          {property.floor && (
            <span>
              {property.floor}/{property.totalFloors}-qavat
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <p className="text-base font-bold text-primary">
            {formatPrice(property.price)}
            {isRent && (
              <span className="text-xs font-normal text-muted-foreground">
                {' /oyiga'}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}
