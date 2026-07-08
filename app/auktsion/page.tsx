import type { Metadata } from 'next'
import { FileCheck, Gavel, ShieldCheck, Wallet } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LiveAuctionPanel } from '@/components/auction/live-auction-panel'
import { AuctionCard } from '@/components/auction/auction-card'
import { auctions, getLiveAuction } from '@/lib/data/auctions'

export const metadata: Metadata = {
  title: 'E-Auktsion',
  description:
    "Davlat mulklari e-auktsioni: jonli kim oshdi savdolari, shaffof bidding va onlayn ishtirok. O'zbekiston bo'ylab.",
}

const steps = [
  {
    icon: FileCheck,
    title: "KYC ro'yxatdan o'tish",
    text: "Passport yoki ID karta orqali shaxsingizni tasdiqlang — 5 daqiqada onlayn.",
  },
  {
    icon: Wallet,
    title: "Garov depozit to'lash",
    text: "Boshlang'ich narxning 5% miqdorida depozit — Payme, Click yoki Uzum Pay orqali.",
  },
  {
    icon: Gavel,
    title: 'Jonli savdoda ishtirok',
    text: "Real vaqtda taklif bering, joriy narx va raqiblar sonini jonli kuzating.",
  },
  {
    icon: ShieldCheck,
    title: "G'olib va shartnoma",
    text: "G'olib avtomatik aniqlanadi, shartnoma e-imzo bilan onlayn imzolanadi.",
  },
]

export default function AuctionPage() {
  const live = getLiveAuction()
  const others = auctions.filter((a) => a.id !== live.id)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-8 md:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            E-Auktsion
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Davlat mulklari shaffof elektron auktsionlarda sotiladi — jonli bidding,
            avtomatik g&apos;olib aniqlash va e-imzo shartnoma bilan.
          </p>
        </div>

        <LiveAuctionPanel auction={live} />

        <section aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="text-xl font-bold text-foreground">
            Barcha auktsionlar
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="how-heading"
          className="rounded-2xl border border-border bg-secondary p-6 md:p-8"
        >
          <h2 id="how-heading" className="text-xl font-bold text-secondary-foreground">
            Qanday ishtirok etiladi?
          </h2>
          <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {i + 1}-qadam
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              )
            })}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
