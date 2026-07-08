'use client'

import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Bell, LineChart, Wallet } from 'lucide-react'
import { MarketChart } from '@/components/dashboard/market-chart'
import { RoiCalculator } from '@/components/investor/roi-calculator'
import {
  portfolioItems,
  WATCH_ALERT_LABELS,
  watchedProperties,
} from '@/lib/data/portfolio'
import { formatPrice } from '@/lib/data/properties'

export function InvestorClient() {
  const totalBuy = portfolioItems.reduce((s, p) => s + p.buyPrice, 0)
  const totalCurrent = portfolioItems.reduce((s, p) => s + p.currentPrice, 0)
  const totalIncome = portfolioItems.reduce((s, p) => s + (p.monthlyIncome ?? 0), 0)
  const growth = ((totalCurrent - totalBuy) / totalBuy) * 100

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="size-4" aria-hidden="true" />
            </span>
            Portfolio qiymati
          </dt>
          <dd className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-card-foreground">
              {formatPrice(totalCurrent)}
            </span>
            <span className="text-xs font-semibold text-accent">+{growth.toFixed(1)}%</span>
          </dd>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LineChart className="size-4" aria-hidden="true" />
            </span>
            Oylik ijara daromadi
          </dt>
          <dd className="text-xl font-bold text-card-foreground">{formatPrice(totalIncome)}</dd>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-4" aria-hidden="true" />
            </span>
            AI Kuzatuvdagi mulklar
          </dt>
          <dd className="text-xl font-bold text-card-foreground">
            {watchedProperties.length} ta
          </dd>
        </div>
      </dl>

      <section aria-labelledby="portfolio-heading">
        <h2 id="portfolio-heading" className="text-sm font-semibold text-foreground">
          Portfolio boshqaruv
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Mulk</th>
                <th scope="col" className="px-4 py-3 font-medium">Sotib olingan</th>
                <th scope="col" className="px-4 py-3 font-medium">Joriy narx</th>
                <th scope="col" className="px-4 py-3 font-medium">O&apos;sish</th>
                <th scope="col" className="px-4 py-3 font-medium">Ijara/oy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {portfolioItems.map((item) => {
                const change = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100
                return (
                  <tr key={item.id} className="transition-colors hover:bg-muted">
                    <td className="px-4 py-3">
                      <Link
                        href={`/mulklar/${item.propertyId}`}
                        className="font-medium text-card-foreground hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.district}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPrice(item.buyPrice)}
                    </td>
                    <td className="px-4 py-3 font-medium text-card-foreground">
                      {formatPrice(item.currentPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          change >= 0 ? 'text-accent' : 'text-destructive'
                        }`}
                      >
                        {change >= 0 ? (
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="size-3.5" aria-hidden="true" />
                        )}
                        {change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.monthlyIncome ? formatPrice(item.monthlyIncome) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="market-analysis-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <h2
              id="market-analysis-heading"
              className="text-sm font-semibold text-card-foreground"
            >
              Bozor tahlili — o&apos;tgan 12 oylik dinamika
            </h2>
            <span className="text-xs font-semibold text-accent">+20.2% / yil</span>
          </div>
          <div className="mt-4">
            <MarketChart />
          </div>
        </section>

        <section
          aria-labelledby="watcher-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="watcher-heading" className="text-sm font-semibold text-card-foreground">
            AI Kuzatuvchi
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Narx o&apos;zgarganda avtomatik xabar olasiz
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {watchedProperties.map((w) => (
              <li
                key={w.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-secondary p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary-foreground">
                    {w.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(w.price)} — 30 kunda{' '}
                    <span
                      className={`font-semibold ${
                        w.change30d >= 0 ? 'text-accent' : 'text-destructive'
                      }`}
                    >
                      {w.change30d >= 0 ? '+' : ''}
                      {w.change30d}%
                    </span>
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    w.alert === 'sotish'
                      ? 'bg-accent/15 text-accent'
                      : w.alert === 'sotib-olish'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {WATCH_ALERT_LABELS[w.alert]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="roi-heading"
        className="rounded-xl border border-border bg-card p-5"
      >
        <h2 id="roi-heading" className="text-sm font-semibold text-card-foreground">
          ROI kalkulyator
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Sotib olish narxi, xarajatlar va bashorat qilingan sotish narxi asosida foydani hisoblang
        </p>
        <div className="mt-5">
          <RoiCalculator />
        </div>
      </section>
    </div>
  )
}
