'use client'

import { useMemo, useState } from 'react'
import { Calculator, CheckCircle2, DollarSign, Home, PieChart, ShieldCheck } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export function R2oCalculator({ onOpenAgreement }: { onOpenAgreement?: () => void }) {
  const [propertyPrice, setPropertyPrice] = useState<number>(1_200_000_000)
  const [contractMonths, setContractMonths] = useState<number>(36)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(15_000_000)

  const calculations = useMemo(() => {
    const totalPaidOverTerm = monthlyPayment * contractMonths
    // 60% of monthly payment goes to equity accumulation, 40% goes to pure rent
    const equityPerMonth = monthlyPayment * 0.6
    const rentPerMonth = monthlyPayment * 0.4

    const totalEquityAccumulated = equityPerMonth * contractMonths
    const equityPercent = Math.min(100, Math.round((totalEquityAccumulated / propertyPrice) * 100))
    const remainingBalance = Math.max(0, propertyPrice - totalEquityAccumulated)

    return {
      totalPaidOverTerm,
      equityPerMonth,
      rentPerMonth,
      totalEquityAccumulated,
      equityPercent,
      remainingBalance,
    }
  }, [propertyPrice, contractMonths, monthlyPayment])

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Home className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">
              Rent-to-Own Jadval & Ulush Kalkulyatori
            </h3>
            <p className="text-xs text-muted-foreground">
              Ijara to&apos;lovlari orqali mulk egaligiga o&apos;tish jadvalini hisoblang
            </p>
          </div>
        </div>

        {onOpenAgreement && (
          <button
            type="button"
            onClick={onOpenAgreement}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity shadow"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Price-Lock Shartnoma (E-Imzo)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="flex flex-col gap-5">
          {/* Mulk narxi */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Mulkning kelishilgan narxi:</span>
              <span className="font-bold text-primary">{formatPrice(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min={400_000_000}
              max={4_000_000_000}
              step={50_000_000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg accent-primary bg-muted cursor-pointer"
            />
          </div>

          {/* Muddat */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Shartnoma muddati (oy):</span>
            <div className="grid grid-cols-5 gap-2">
              {[12, 24, 36, 48, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setContractMonths(m)}
                  className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                    contractMonths === m
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {m} oy
                </button>
              ))}
            </div>
          </div>

          {/* Oylik to'lov */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Oylik to&apos;lov miqdori:</span>
              <span className="font-bold text-accent">{formatPrice(monthlyPayment)} /oy</span>
            </div>
            <input
              type="range"
              min={5_000_000}
              max={50_000_000}
              step={1_000_000}
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full h-2 rounded-lg accent-accent bg-muted cursor-pointer"
            />
          </div>
        </div>

        {/* Visual Equity Breakdown */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">To&apos;plangan mulk egaligi ulushi:</span>
              <span className="text-base font-bold text-accent">{calculations.equityPercent}%</span>
            </div>
            <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted border border-border">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                style={{ width: `${calculations.equityPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-border bg-card p-3">
              <span className="text-muted-foreground text-[11px]">Sotib olish ulushi (60%):</span>
              <p className="text-sm font-bold text-accent mt-0.5">
                {formatPrice(calculations.equityPerMonth)} /oy
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <span className="text-muted-foreground text-[11px]">Ijara qismi (40%):</span>
              <p className="text-sm font-bold text-muted-foreground mt-0.5">
                {formatPrice(calculations.rentPerMonth)} /oy
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{contractMonths} oyda to&apos;plangan ulush:</span>
              <span className="font-bold text-primary">{formatPrice(calculations.totalEquityAccumulated)}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-primary/20 pt-1.5">
              <span className="font-bold text-foreground">Sotib olish uchun qolgan balans:</span>
              <span className="font-bold text-foreground">{formatPrice(calculations.remainingBalance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
