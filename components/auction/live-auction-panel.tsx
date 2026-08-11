'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  AlertTriangle,
  Gavel,
  MapPin,
  Maximize,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BiddingModal } from '@/components/auction/bidding-modal'
import { DepositModal } from '@/components/auction/deposit-modal'
import { formatPrice } from '@/lib/data/properties'
import { AUCTION_TYPE_LABELS, type Auction } from '@/lib/data/auctions'

interface BidEntry {
  id: string
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
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const isUrgent = diff > 0 && diff < 60_000 // Under 1 minute
  return { days, hours, minutes, seconds, ended: diff === 0, isUrgent }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function LiveAuctionPanel({ auction }: { auction: Auction }) {
  const { days, hours, minutes, seconds, ended, isUrgent } = useCountdown(auction.endsAt)
  const [currentBid, setCurrentBid] = useState(auction.currentBid)
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false)

  // Bids Feed
  const [bids, setBids] = useState<BidEntry[]>([
    { id: 'b1', bidder: 'Ishtirokchi #482', amount: auction.currentBid, time: '10s oldin' },
    { id: 'b2', bidder: 'Ishtirokchi #195', amount: auction.currentBid - auction.bidIncrement, time: '1m oldin' },
    { id: 'b3', bidder: 'Ishtirokchi #073', amount: auction.currentBid - auction.bidIncrement * 2, time: '3m oldin' },
  ])

  // Modals state
  const [isBiddingOpen, setIsBiddingOpen] = useState(false)
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [selectedBidAmount, setSelectedBidAmount] = useState(auction.currentBid + auction.bidIncrement)
  const [customBidInput, setCustomBidInput] = useState('')

  // Simulate incoming live bids every 15s
  useEffect(() => {
    if (ended) return
    const interval = setInterval(() => {
      const randInc = Math.floor(Math.random() * 3 + 1) * auction.bidIncrement
      const randomBidderId = Math.floor(Math.random() * 800 + 100)
      setCurrentBid((prev) => {
        const next = prev + randInc
        setBids((b) => [
          {
            id: `b-${Date.now()}`,
            bidder: `Ishtirokchi #${randomBidderId}`,
            amount: next,
            time: 'Hozir',
          },
          ...b.slice(0, 5),
        ])
        return next
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [ended, auction.bidIncrement])

  function handleOpenBidding(increment: number) {
    if (!hasPaidDeposit) {
      setIsDepositOpen(true)
      return
    }
    const targetAmount = currentBid + increment
    setSelectedBidAmount(targetAmount)
    setIsBiddingOpen(true)
  }

  function handleCustomBidSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = Number(customBidInput)
    if (!val || val <= currentBid) {
      alert(`Stavka joriy eng yuqori taklifdan (${formatPrice(currentBid)}) yuqori bo'lishi kerak.`)
      return
    }
    if (!hasPaidDeposit) {
      setIsDepositOpen(true)
      return
    }
    setSelectedBidAmount(val)
    setIsBiddingOpen(true)
  }

  function confirmBidHandler(amount: number) {
    setCurrentBid(amount)
    setBids((prev) => [
      { id: `b-${Date.now()}`, bidder: 'Siz (Sizning stavkangiz)', amount, time: 'Hozir' },
      ...prev.slice(0, 5),
    ])
  }

  return (
    <section
      aria-labelledby="live-auction-heading"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {/* Live Indicator Header */}
      <div className={`flex items-center gap-2 border-b border-border px-5 py-3 transition-colors ${
        isUrgent ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-destructive/10 text-destructive'
      }`}>
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-destructive" />
        </span>
        <h2 id="live-auction-heading" className="text-sm font-bold uppercase tracking-wide">
          JONLI E-AUKTSION TAKLIFLARI
        </h2>
        {isUrgent && (
          <span className="flex items-center gap-1 text-xs font-bold text-destructive animate-bounce ml-2">
            <AlertTriangle className="size-4" aria-hidden="true" />
            Yakunlanishiga 1 daqiqadan kam vaqt qoldi!
          </span>
        )}
        <span className="ml-auto text-xs font-semibold text-muted-foreground">
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

        <div className="flex flex-col gap-5 p-6">
          <div>
            <h3 className="text-lg font-bold leading-snug text-card-foreground text-balance">
              {auction.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                {auction.region}
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="size-3.5 text-primary" aria-hidden="true" />
                {auction.area.toLocaleString('uz-UZ')} m²
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5 text-primary" aria-hidden="true" />
                {auction.bidders} ishtirokchi
              </span>
            </div>
          </div>

          {/* Price & Countdown Box */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4 border border-border">
            <div>
              <p className="text-xs text-muted-foreground">Joriy Eng Yuqori Taklif</p>
              <p className="flex items-center gap-1.5 text-2xl font-bold text-primary">
                <TrendingUp className="size-6" aria-hidden="true" />
                {formatPrice(currentBid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tugashiga Qoldi</p>
              <p
                className={`font-mono text-xl font-bold tabular-nums ${
                  isUrgent ? 'text-destructive text-2xl animate-pulse' : 'text-foreground'
                }`}
                aria-live="polite"
              >
                {ended ? 'Yakunlandi' : `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
              </p>
            </div>
          </div>

          {/* Bidding Quick Buttons */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-foreground">Tezkor Stavka Qo&apos;shish:</span>
            <div className="grid grid-cols-3 gap-2">
              {[1_000_000, 5_000_000, 10_000_000].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleOpenBidding(inc)}
                  disabled={ended}
                  className="flex items-center justify-center gap-1 rounded-xl border border-primary/30 bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
                >
                  <Plus className="size-3" aria-hidden="true" />
                  {inc / 1_000_000} mln
                </button>
              ))}
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomBidSubmit} className="flex gap-2">
              <input
                type="number"
                placeholder="Ixtiyoriy stavka..."
                value={customBidInput}
                onChange={(e) => setCustomBidInput(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
              <button
                type="submit"
                disabled={ended}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                Yuborish
              </button>
            </form>
          </div>

          {/* Deposit Status Banner */}
          <div className="flex items-center justify-between rounded-xl bg-secondary p-3 text-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`size-4 ${hasPaidDeposit ? 'text-accent' : 'text-muted-foreground'}`} aria-hidden="true" />
              <span className="text-secondary-foreground font-medium">
                {hasPaidDeposit ? 'Garov depoziti to\'langan (5%)' : 'Garov depoziti talab etiladi'}
              </span>
            </div>
            {!hasPaidDeposit && (
              <button
                type="button"
                onClick={() => setIsDepositOpen(true)}
                className="rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground hover:opacity-90"
              >
                Depozit To&apos;lash
              </button>
            )}
          </div>

          {/* Real-time Bids Feed */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Jonli Takliflar Tarixi (Bids Feed)
            </h4>
            <ul className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {bids.map((b, i) => (
                <li
                  key={b.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-all animate-in fade-in slide-in-from-top-1 ${
                    i === 0
                      ? 'bg-accent/15 font-bold text-foreground border border-accent/30'
                      : 'bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <span className="truncate max-w-[140px]">{b.bidder}</span>
                  <span className="tabular-nums font-bold text-primary">{formatPrice(b.amount)}</span>
                  <span className="text-[10px] text-muted-foreground">{b.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bidding Confirmation Modal */}
      <BiddingModal
        isOpen={isBiddingOpen}
        onClose={() => setIsBiddingOpen(false)}
        propertyTitle={auction.title}
        currentBid={currentBid}
        bidAmount={selectedBidAmount}
        bidIncrement={auction.bidIncrement}
        onConfirmBid={confirmBidHandler}
      />

      {/* Deposit Payment Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        depositAmount={auction.deposit}
        onDepositSuccess={() => setHasPaidDeposit(true)}
      />
    </section>
  )
}
