'use client'

import { useMemo, useState } from 'react'
import { Calculator, DollarSign, PieChart, Sparkles, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export function RoiCalculator() {
  const [investmentUsd, setInvestmentUsd] = useState(100_000)
  const [monthlyRentUsd, setMonthlyRentUsd] = useState(900)
  const [appreciationPercent, setAppreciationPercent] = useState(8)
  const [holdingYears, setHoldingYears] = useState<1 | 3 | 5>(3)

  const usdExchangeRate = 12_800 // 1 USD = 12,800 UZS

  const metrics = useMemo(() => {
    const initialInvestmentUzxs = investmentUsd * usdExchangeRate
    const annualRentUsd = monthlyRentUsd * 12
    const totalRentIncomeUsd = annualRentUsd * holdingYears

    // Compound appreciation: FutureValue = Investment * (1 + rate)^years
    const futureValueUsd = investmentUsd * Math.pow(1 + appreciationPercent / 100, holdingYears)
    const capitalAppreciationUsd = futureValueUsd - investmentUsd

    const totalProfitUsd = totalRentIncomeUsd + capitalAppreciationUsd
    const totalReturnUsd = investmentUsd + totalProfitUsd

    const totalRoiPercent = (totalProfitUsd / investmentUsd) * 100
    const annualizedRoiPercent = totalRoiPercent / holdingYears

    // Yearly projections
    const timeline = Array.from({ length: 5 }, (_, i) => {
      const year = i + 1
      const yearVal = investmentUsd * Math.pow(1 + appreciationPercent / 100, year)
      const yearRent = annualRentUsd * year
      return {
        year: `${year}-yil`,
        propertyValueUsd: Math.round(yearVal),
        cumulativeRentUsd: Math.round(yearRent),
        totalAssetUsd: Math.round(yearVal + yearRent),
      }
    })

    return {
      initialInvestmentUzxs,
      totalRentIncomeUsd,
      capitalAppreciationUsd,
      futureValueUsd,
      totalProfitUsd,
      totalReturnUsd,
      totalRoiPercent,
      annualizedRoiPercent,
      timeline,
    }
  }, [investmentUsd, monthlyRentUsd, appreciationPercent, holdingYears, usdExchangeRate])

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">
              Investor ROI Interaktiv Kalkulyatori
            </h3>
            <p className="text-xs text-muted-foreground">
              Kapital o&apos;sishi va ijara daromadi bo&apos;yicha 5 yillik moliyaviy bashorat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          {([1, 3, 5] as const).map((years) => (
            <button
              key={years}
              type="button"
              onClick={() => setHoldingYears(years)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                holdingYears === years
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              {years} Yil
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input Controls */}
        <div className="flex flex-col gap-5">
          {/* Boshlang'ich investitsiya */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Boshlang&apos;ich investitsiya ($ USD)</span>
              <span className="font-bold text-primary">${investmentUsd.toLocaleString('en-US')}</span>
            </div>
            <input
              type="range"
              min={10_000}
              max={500_000}
              step={5_000}
              value={investmentUsd}
              onChange={(e) => setInvestmentUsd(Number(e.target.value))}
              className="w-full h-2 rounded-lg accent-primary bg-muted cursor-pointer"
            />
            <span className="text-[11px] text-muted-foreground">
              Ekvivalent: {formatPrice(metrics.initialInvestmentUzxs)}
            </span>
          </div>

          {/* Oylik Ijara */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Kutilayotgan oylik ijara tushumi ($ USD)</span>
              <span className="font-bold text-primary">${monthlyRentUsd.toLocaleString('en-US')} /oy</span>
            </div>
            <input
              type="range"
              min={100}
              max={5_000}
              step={50}
              value={monthlyRentUsd}
              onChange={(e) => setMonthlyRentUsd(Number(e.target.value))}
              className="w-full h-2 rounded-lg accent-primary bg-muted cursor-pointer"
            />
            <span className="text-[11px] text-muted-foreground">
              Yillik ijara rentabelligi: {((monthlyRentUsd * 12 / investmentUsd) * 100).toFixed(1)}%
            </span>
          </div>

          {/* Narx o'sishi */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Projnoz qilingan yillik narx o&apos;sishi (%)</span>
              <span className="font-bold text-accent">+{appreciationPercent}% /yil</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={appreciationPercent}
              onChange={(e) => setAppreciationPercent(Number(e.target.value))}
              className="w-full h-2 rounded-lg accent-accent bg-muted cursor-pointer"
            />
          </div>
        </div>

        {/* Output Metrics & Projections */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <span className="text-[11px] text-muted-foreground">Jamg&apos;arilgan Ijara</span>
              <p className="text-base font-bold text-foreground mt-0.5">
                ${metrics.totalRentIncomeUsd.toLocaleString('en-US')}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <span className="text-[11px] text-muted-foreground">Kapital O&apos;sishi</span>
              <p className="text-base font-bold text-accent mt-0.5">
                +${Math.round(metrics.capitalAppreciationUsd).toLocaleString('en-US')}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-primary/10 p-4 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-6 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">{holdingYears} Yillik Jami ROI</p>
                <p className="text-xl font-bold text-primary">
                  +{metrics.totalRoiPercent.toFixed(1)}% ({metrics.annualizedRoiPercent.toFixed(1)}% /yil)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground">Sof Foyda</span>
              <p className="text-base font-bold text-accent">
                +${Math.round(metrics.totalProfitUsd).toLocaleString('en-US')}
              </p>
            </div>
          </div>

          {/* 5-Year Visual Bar Representation */}
          <div className="flex flex-col gap-2 border-t border-border pt-3">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <PieChart className="size-3.5 text-primary" aria-hidden="true" />
              5 Yillik Aktiv Qiymati O&apos;sishi
            </span>
            <div className="flex items-end justify-between gap-2 h-24 pt-2">
              {metrics.timeline.map((item, index) => {
                const heightPercent = Math.min(100, Math.max(30, (item.totalAssetUsd / (investmentUsd * 2)) * 100))
                const isSelected = index + 1 === holdingYears
                return (
                  <div key={item.year} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isSelected ? 'bg-primary shadow-md' : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.year}: $${item.totalAssetUsd.toLocaleString('en-US')}`}
                    />
                    <span className={`text-[10px] ${isSelected ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      Yil {index + 1}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
