'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Gavel, MapPin, Maximize, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/data/properties'
import { AUCTION_TYPE_LABELS, type Auction } from '@/lib/data/auctions'

interface BidEntry {
  bidder: string
  amount: number
  time: string
}

function useCountdown(target: string) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, targetMs - now)
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { hours, minutes, seconds, ended: diff === 0 }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function LiveAuctionPanel({ auction }: { auction: Auction }) {
  const { hours, minutes, seconds, ended } = useCountdown(auction.endsAt)
  const [currentBid, setCurrentBid] = useState(auction.currentBid)
  const [bids, setBids] = useState<BidEntry[]>([
    { bidder: 'Ishtirokchi #07', amount: auction.currentBid, time: '2 daqiqa oldin' },
    {
      bidder: 'Ishtirokchi #03',
      amount: auction.currentBid - auction.bidIncrement,
      time: '9 daqiqa oldin',
    },
    {
      bidder: 'Ishtirokchi #11',
      amount: auction.currentBid - auction.bidIncrement * 2,
      time: '14 daqiqa oldin',
    },
  ])
  const [placed, setPlaced] = useState(false)

  function placeBid() {
    const next = currentBid + auction.bidIncrement
    setCurrentBid(next)
    setBids((prev) => [{ bidder: 'Siz', amount: next, time: 'hozir' }, ...prev.slice(0, 5)])
    setPlaced(true)
    setTimeout(() => setPlaced(false), 1500)
  }

  return (
    <section
      aria-labelledby="live-auction-heading"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border bg-destructive/10 px-5 py-2.5">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
        </span>
        <h2 id="live-auction-heading" className="text-sm font-bold text-destructive">
          JONLI AUKTSION
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {AUCTION_TYPE_LABELS[auction.type]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[16/10] lg:aspect-auto">
          <Image
            src={auction.image || '/placeholder.svg'}
            alt={auction.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <h3 className="text-lg font-bold leading-snug text-card-foreground text-balance">
              {auction.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
                {auction.bidders} ishtirokchi
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
            <div>
              <p className="text-xs text-muted-foreground">Joriy eng yuqori taklif</p>
              <p className="flex items-center gap-1.5 text-xl font-bold text-primary">
                <TrendingUp className="size-5" aria-hidden="true" />
                {formatPrice(currentBid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tugashiga qoldi</p>
              <p
                className="font-mono text-xl font-bold text-destructive tabular-nums"
                aria-live="polite"
              >
                {ended ? 'Yakunlandi' : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={placeBid} disabled={ended}>
              <Gavel className="size-4" aria-hidden="true" />
              {placed
                ? 'Taklif qabul qilindi!'
                : `Taklif berish (+${formatPrice(auction.bidIncrement)})`}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
              Garov depozit: {formatPrice(auction.deposit)} — KYC tasdiqlangan
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Takliflar tarixi
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {bids.map((bid, i) => (
                <li
                  key={`${bid.bidder}-${bid.amount}`}
                  className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                    i === 0 ? 'bg-accent/10 font-semibold text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <span>{bid.bidder}</span>
                  <span className="tabular-nums">{formatPrice(bid.amount)}</span>
                  <span className="text-xs">{bid.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
