'use client'

import { CheckCircle2, Circle, Home, Lock, Wallet } from 'lucide-react'
import { PropertyCard } from '@/components/property-card'
import { formatPrice, properties } from '@/lib/data/properties'

// Demo R2O shartnoma: Qibray hovli uy (p-002)
const CONTRACT = {
  propertyTitle: 'Zamonaviy 2 qavatli hovli uy — Qibray',
  lockedPrice: 2_800_000_000,
  monthlyPayment: 28_000_000,
  totalMonths: 36,
  paidMonths: 14,
  startDate: '2025-05-01',
  priceLockDate: '2025-05-01',
}

export function R2oClient() {
  const r2oProperties = properties.filter((p) => p.rentToOwn)
  const paid = CONTRACT.monthlyPayment * CONTRACT.paidMonths
  const remaining = CONTRACT.lockedPrice - paid
  const progress = Math.round((paid / CONTRACT.lockedPrice) * 100)

  const schedule = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = CONTRACT.paidMonths - 3 + i
    const date = new Date(2025, 4 + monthIndex, 1)
    return {
      month: date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' }),
      amount: CONTRACT.monthlyPayment,
      paid: monthIndex < CONTRACT.paidMonths,
    }
  })

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-labelledby="how-heading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <h2 id="how-heading" className="sr-only">
          Rent-to-Own qanday ishlaydi
        </h2>
        {[
          {
            icon: Home,
            title: 'Ijaraga kirasiz',
            text: "Tanlangan uyga oddiy ijarachi sifatida ko'chib o'tasiz va oylik to'lovlarni boshlaysiz.",
          },
          {
            icon: Lock,
            title: 'Narx qulflanadi',
            text: "Shartnoma imzolangan kundagi narx butun muddat davomida o'zgarmaydi — bozor o'ssa ham.",
          },
          {
            icon: Wallet,
            title: "To'lovlar hisobga o'tadi",
            text: "Har bir oylik to'lov uy narxidan ayiriladi. Muddat oxirida qoldiqni to'lab uy egasiga aylanasiz.",
          },
        ].map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {i + 1}-qadam
                </span>
              </div>
              <h3 className="text-sm font-semibold text-card-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          )
        })}
      </section>

      <section
        aria-labelledby="contract-heading"
        className="rounded-xl border border-border bg-card p-5 md:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="contract-heading" className="text-sm font-semibold text-card-foreground">
            Demo shartnoma — {CONTRACT.propertyTitle}
          </h2>
          <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
            <Lock className="size-3" aria-hidden="true" />
            Narx qulflangan: {formatPrice(CONTRACT.lockedPrice)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Oylik to&apos;lov</dt>
                <dd className="mt-1 font-bold text-secondary-foreground">
                  {formatPrice(CONTRACT.monthlyPayment)}
                </dd>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Muddat</dt>
                <dd className="mt-1 font-bold text-secondary-foreground">
                  {CONTRACT.paidMonths} / {CONTRACT.totalMonths} oy
                </dd>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">To&apos;langan</dt>
                <dd className="mt-1 font-bold text-accent">{formatPrice(paid)}</dd>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Qoldiq</dt>
                <dd className="mt-1 font-bold text-secondary-foreground">
                  {formatPrice(remaining)}
                </dd>
              </div>
            </dl>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sotib olishga progress</span>
                <span className="font-semibold text-primary">{progress}%</span>
              </div>
              <div
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Sotib olish progressi"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Muddat yakunida qoldiq {formatPrice(remaining)} to&apos;lansa, mulk sizning
                nomingizga rasmiylashtiriladi. Qayta sotib olish huquqi shartnomada
                kafolatlangan.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground">
              To&apos;lov jadvali (oxirgi va keyingi oylar)
            </h3>
            <ul className="mt-3 flex flex-col divide-y divide-border rounded-lg border border-border">
              {schedule.map((row) => (
                <li
                  key={row.month}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    {row.paid ? (
                      <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className="text-card-foreground">{row.month}</span>
                  </span>
                  <span
                    className={
                      row.paid
                        ? 'font-medium text-accent'
                        : 'font-medium text-muted-foreground'
                    }
                  >
                    {formatPrice(row.amount)}
                    <span className="ml-2 text-xs">
                      {row.paid ? "to'landi" : 'kutilmoqda'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="r2o-list-heading">
        <h2 id="r2o-list-heading" className="text-sm font-semibold text-foreground">
          Rent-to-Own rejimida taklif qilinayotgan mulklar
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {r2oProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
