'use client'

import { useState } from 'react'
import {
  BadgeCheck,
  Building2,
  CalendarPlus,
  Check,
  Heart,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Property, formatPrice } from '@/lib/data/properties'

export function PropertyContactPanel({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false)
  const [requested, setRequested] = useState(false)
  const isRent = property.status === 'ijaraga'

  const monthlyR2O = property.rentToOwn
    ? Math.round(property.price / (isRent ? 1 : 60))
    : null

  return (
    <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-20">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-2xl font-bold text-primary">
          {formatPrice(property.price)}
          {isRent && (
            <span className="text-sm font-normal text-muted-foreground"> /oyiga</span>
          )}
        </p>
        {property.pricePerM2 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatPrice(property.pricePerM2)} / m²
          </p>
        )}

        {property.rentToOwn && monthlyR2O && !isRent && (
          <div className="mt-3 rounded-lg bg-accent/10 p-3">
            <p className="text-xs font-semibold text-accent">Rent-to-Own mavjud</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Oyiga ~{formatPrice(monthlyR2O)} dan, narx qulflash bilan
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Button className="w-full" onClick={() => setRequested(true)} disabled={requested}>
            {requested ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                {"So'rov yuborildi"}
              </>
            ) : (
              <>
                <MessageCircle className="size-4" aria-hidden="true" />
                Sotuvchi bilan chat
              </>
            )}
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <CalendarPlus className="size-4" aria-hidden="true" />
            {"Ko'rish uchun uchrashuv"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setSaved(!saved)}
            aria-pressed={saved}
          >
            <Heart
              className={`size-4 ${saved ? 'fill-destructive text-destructive' : ''}`}
              aria-hidden="true"
            />
            {saved ? 'Sevimlilarda' : "Sevimlilarga qo'shish"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Sotuvchi</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-card-foreground">
              {property.seller.name}
              {property.seller.verified && (
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
              )}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {property.seller.type}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-secondary-foreground">
          Barcha to&apos;lovlar platforma escrow hisobi orqali xavfsiz amalga oshiriladi.
          Shartnoma e-imzo bilan imzolanadi.
        </p>
      </div>
    </aside>
  )
}
