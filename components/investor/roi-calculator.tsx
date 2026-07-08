'use client'

import { useMemo, useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

interface Field {
  key: 'buyPrice' | 'expenses' | 'sellPrice' | 'months' | 'monthlyRent'
  label: string
  suffix: string
}

const FIELDS: Field[] = [
  { key: 'buyPrice', label: 'Sotib olish narxi', suffix: "mln so'm" },
  { key: 'expenses', label: "Xarajatlar (ta'mir, soliq, komissiya)", suffix: "mln so'm" },
  { key: 'sellPrice', label: 'Bashorat qilingan sotish narxi', suffix: "mln so'm" },
  { key: 'monthlyRent', label: 'Oylik ijara daromadi (ixtiyoriy)', suffix: "mln so'm" },
  { key: 'months', label: 'Egalik muddati', suffix: 'oy' },
]

export function RoiCalculator() {
  const [values, setValues] = useState({
    buyPrice: 1000,
    expenses: 80,
    sellPrice: 1250,
    monthlyRent: 8,
    months: 18,
  })

  const result = useMemo(() => {
    const invested = values.buyPrice + values.expenses
    const rentIncome = values.monthlyRent * values.months
    const profit = values.sellPrice + rentIncome - invested
    const roi = invested > 0 ? (profit / invested) * 100 : 0
    const annualRoi = values.months > 0 ? roi * (12 / values.months) : 0
    return { invested, rentIncome, profit, roi, annualRoi }
  }, [values])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        {FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={values[field.key]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.key]: Number(e.target.value) || 0 }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
              <span className="shrink-0 text-xs text-muted-foreground">{field.suffix}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-secondary p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
          <Calculator className="size-4 text-primary" aria-hidden="true" />
          Hisob-kitob natijasi
        </div>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Jami investitsiya</dt>
            <dd className="font-medium text-secondary-foreground">
              {formatPrice(result.invested * 1_000_000)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Ijara daromadi ({values.months} oy)</dt>
            <dd className="font-medium text-secondary-foreground">
              {formatPrice(result.rentIncome * 1_000_000)}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <dt className="text-muted-foreground">Sof foyda</dt>
            <dd
              className={`font-bold ${result.profit >= 0 ? 'text-accent' : 'text-destructive'}`}
            >
              {result.profit >= 0 ? '+' : ''}
              {formatPrice(result.profit * 1_000_000)}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex items-center justify-between rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted-foreground">ROI (umumiy / yillik)</p>
              <p className="text-lg font-bold text-primary">
                {result.roi.toFixed(1)}% / {result.annualRoi.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
