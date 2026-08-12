'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, MapPin, Sparkles, TrendingDown, TrendingUp, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiMatchModal } from '@/components/avm/ai-match-modal'
import { estimatePrice, type AvmResult } from '@/lib/avm'
import {
  formatPrice,
  properties,
  PROPERTY_TYPE_LABELS,
  REGIONS,
  type PropertyType,
} from '@/lib/data/properties'
import { cn } from '@/lib/utils'

const CURRENT_YEAR = new Date().getFullYear()

export function AvmClient() {
  const [region, setRegion] = useState<string>('Toshkent shahri')
  const [type, setType] = useState<PropertyType>('kvartira')
  const [area, setArea] = useState('75')
  const [rooms, setRooms] = useState('3')
  const [floor, setFloor] = useState('4')
  const [totalFloors, setTotalFloors] = useState('9')
  const [yearBuilt, setYearBuilt] = useState('2018')
  const [hasRenovation, setHasRenovation] = useState(true)
  const [nearMetro, setNearMetro] = useState(false)
  const [result, setResult] = useState<AvmResult | null>(null)
  const [isAiMatchOpen, setIsAiMatchOpen] = useState(false)

  const comparables = useMemo(() => {
    if (!result) return []
    return properties
      .filter((p) => p.region === region && p.status !== 'sotilgan')
      .slice(0, 3)
  }, [result, region])

  const [formError, setFormError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const areaNum = Number(area)
    if (!areaNum || areaNum <= 0) {
      setFormError('Maydon miqdori noldan katta bo\'lishi shart')
      return
    }

    const floorNum = Number(floor)
    const totalNum = Number(totalFloors)
    if (floorNum && totalNum && floorNum > totalNum) {
      setFormError(`Qavat (${floorNum}) jami qavatlar sonidan (${totalNum}) katta bo'lishi mumkin emas`)
      return
    }

    setResult(
      estimatePrice({
        region,
        type,
        area: areaNum,
        rooms: Number(rooms) || 1,
        floor: floorNum || undefined,
        totalFloors: totalNum || undefined,
        yearBuilt: Number(yearBuilt) || CURRENT_YEAR,
        hasRenovation,
        nearMetro,
      }),
    )
  }

  const inputClass =
    'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary'
  const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 lg:col-span-2 shadow-sm"
      >
        <div className="flex items-center gap-2 text-foreground">
          <Calculator className="size-5 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">Mulk parametrlari</h2>
        </div>

        {formError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="avm-region" className={labelClass}>
            Hudud
          </label>
          <select
            id="avm-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputClass}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="avm-type" className={labelClass}>
            Mulk turi
          </label>
          <select
            id="avm-type"
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType)}
            className={inputClass}
          >
            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((t) => (
              <option key={t} value={t}>
                {PROPERTY_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="avm-area" className={labelClass}>
              Maydon (m²)
            </label>
            <input
              id="avm-area"
              type="number"
              min={10}
              max={5000}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="avm-rooms" className={labelClass}>
              Xonalar soni
            </label>
            <input
              id="avm-rooms"
              type="number"
              min={1}
              max={30}
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="avm-floor" className={labelClass}>
              Qavat
            </label>
            <input
              id="avm-floor"
              type="number"
              min={1}
              max={60}
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="avm-total-floors" className={labelClass}>
              Jami qavatlar
            </label>
            <input
              id="avm-total-floors"
              type="number"
              min={1}
              max={60}
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="avm-year" className={labelClass}>
            Qurilgan yili
          </label>
          <input
            id="avm-year"
            type="number"
            min={1950}
            max={CURRENT_YEAR + 3}
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={hasRenovation}
              onChange={(e) => setHasRenovation(e.target.checked)}
              className="size-4 accent-primary"
            />
            {"Yevro ta'mir qilingan"}
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={nearMetro}
              onChange={(e) => setNearMetro(e.target.checked)}
              className="size-4 accent-primary"
            />
            Metro bekati yaqin (10 daqiqa piyoda)
          </label>
        </div>

        <Button type="submit" className="mt-1 font-bold">
          <Sparkles className="size-4" aria-hidden="true" />
          Sun&apos;iy Intellekt Narxini Baholash
        </Button>
      </form>

      <div className="flex flex-col gap-4 lg:col-span-3">
        {result ? (
          <>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Taxminiy bozor qiymati (AI AVM)</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                      <Sparkles className="size-3" aria-hidden="true" />
                      AI Ishonch: {result.confidenceScore}%
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                    {formatPrice(result.estimatedPrice)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiMatchOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="size-4" aria-hidden="true" />
                  <span>AI Match Mos Mulklar</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="size-4 text-muted-foreground" aria-hidden="true" />
                  Quyi chegara: <span className="font-bold text-foreground">{formatPrice(result.lowPrice)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-4 text-accent" aria-hidden="true" />
                  Yuqori chegara: <span className="font-bold text-accent">{formatPrice(result.highPrice)}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                1 m² uchun o&apos;rtacha: <span className="font-semibold text-foreground">{formatPrice(result.pricePerM2)}</span>
              </p>
            </div>

            {/* Visual Breakdown of Price Factors */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-3 font-semibold text-foreground text-sm">
                Narxga ta&apos;sir qilgan omillar (Impact Breakdown)
              </h3>
              <ul className="flex flex-col gap-2.5">
                {result.factors.map((f) => (
                  <li key={f.label} className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-foreground font-medium">{f.label}</span>
                    <span
                      className={cn(
                        'font-bold tabular-nums px-2 py-0.5 rounded text-xs',
                        f.impact >= 0
                          ? 'bg-accent/10 text-accent'
                          : 'bg-destructive/10 text-destructive',
                      )}
                    >
                      {f.impact >= 0 ? '+' : ''}
                      {f.impact.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Bu baholash avtomatik model (AVM) va o&apos;xshash e&apos;lonlar statistikasi bo&apos;yicha hisoblangan.
              </p>
            </div>

            {comparables.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-3 font-semibold text-foreground text-sm">
                  Shu hududdagi taqqoslanadigan mulklar
                </h3>
                <ul className="flex flex-col divide-y divide-border">
                  {comparables.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/mulklar/${p.id}`}
                        className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/50"
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-xs font-semibold text-foreground">{p.title}</span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="size-3" aria-hidden="true" />
                            {p.district} · {p.area} m² · {p.rooms} xona
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-bold text-primary">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calculator className="size-7" aria-hidden="true" />
            </span>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Chapdagi formani to&apos;ldiring va &laquo;Sun&apos;iy Intellekt Narxini Baholash&raquo; tugmasini
              bosing — AI model mulkingiz qiymatini bir zumda hisoblab beradi.
            </p>
          </div>
        )}
      </div>

      {/* AI Match Modal */}
      <AiMatchModal
        isOpen={isAiMatchOpen}
        onClose={() => setIsAiMatchOpen(false)}
        estimatedPrice={result?.estimatedPrice}
        region={region}
      />
    </div>
  )
}
