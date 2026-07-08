'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Clock, MapPin, Maximize, Users } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'
import {
  AUCTION_STATUS_LABELS,
  AUCTION_TYPE_LABELS,
  type Auction,
} from '@/lib/data/auctions'

function formatRemaining(endsAt: string, now: number): string {
  const diff = new Date(endsAt).getTime() - now
  if (diff <= 0) return 'Yakunlangan'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h >= 24) return `${Math.floor(h / 24)} kun ${h % 24} soat`
  return `${h} soat ${m} daqiqa`
}

export function AuctionCard({ auction }: { auction: Auction }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const remaining = useMemo(() => formatRemaining(auction.endsAt, now), [auction.endsAt, now])
  const isLive = auction.status === 'jonli'
  const isDone = auction.status === 'yakunlangan'

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={auction.image || '/placeholder.svg'}
          alt={auction.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              isLive
                ? 'bg-destructive text-white'
                : isDone
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary text-primary-foreground'
            }`}
          >
            {AUCTION_STATUS_LABELS[auction.status]}
          </span>
          <span className="rounded-md bg-card px-2 py-0.5 text-xs font-medium text-foreground">
            {AUCTION_TYPE_LABELS[auction.type]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground text-pretty">
          {auction.title}
        </h3>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {auction.region}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="size-3.5" aria-hidden="true" />
            {auction.area.toLocaleString('uz-UZ')} m²
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {auction.bidders}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {isDone ? "Yakuniy narx" : 'Joriy taklif'}
            </p>
            <p className="text-base font-bold text-primary">
              {formatPrice(auction.currentBid)}
            </p>
          </div>
          <p
            className={`flex items-center gap-1 text-xs font-medium ${
              isLive ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            <Clock className="size-3.5" aria-hidden="true" />
            {remaining}
          </p>
        </div>
      </div>
    </article>
  )
}
