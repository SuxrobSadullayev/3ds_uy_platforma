'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, MapPin, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  const comparables = useMemo(() => {
    if (!result) return []
    return properties
      .filter((p) => p.region === region && p.status !== 'sotilgan')
      .slice(0, 3)
  }, [result, region])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const areaNum = Number(area)
    if (!areaNum || areaNum <= 0) return
    setResult(
      estimatePrice({
        region,
        type,
        area: areaNum,
        rooms: Number(rooms) || 1,
        floor: Number(floor) || undefined,
        totalFloors: Number(totalFloors) || undefined,
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
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 lg:col-span-2"
      >
        <div className="flex items-center gap-2 text-foreground">
          <Calculator className="size-5 text-primary" aria-hidden="true" />
          <h2 className="font-semibold">Mulk parametrlari</h2>
        </div>

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
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={hasRenovation}
              onChange={(e) => setHasRenovation(e.target.checked)}
              className="size-4 accent-primary"
            />
            {"Yevro ta'mir qilingan"}
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={nearMetro}
              onChange={(e) => setNearMetro(e.target.checked)}
              className="size-4 accent-primary"
            />
            Metro bekati yaqin (10 daqiqa piyoda)
          </label>
        </div>

        <Button type="submit" className="mt-1">
          <Sparkles className="size-4" aria-hidden="true" />
          Narxni baholash
        </Button>
      </form>

      <div className="flex flex-col gap-4 lg:col-span-3">
        {result ? (
          <>
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Taxminiy bozor qiymati</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {formatPrice(result.estimatedPrice)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="size-4" aria-hidden="true" />
                  Quyi chegara: {formatPrice(result.lowPrice)}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-4" aria-hidden="true" />
                  Yuqori chegara: {formatPrice(result.highPrice)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                1 m² uchun: <span className="font-medium text-foreground">{formatPrice(result.pricePerM2)}</span>
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold text-foreground">Narxga ta&apos;sir qilgan omillar</h3>
              <ul className="flex flex-col gap-2">
                {result.factors.map((f) => (
                  <li key={f.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span
                      className={cn(
                        'font-medium tabular-nums',
                        f.impact >= 0 ? 'text-accent' : 'text-destructive',
                      )}
                    >
                      {f.impact >= 0 ? '+' : ''}
                      {f.impact.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Bu baholash avtomatik model (AVM) natijasi bo&apos;lib, ±10% xato
                chegarasiga ega. Rasmiy baholash uchun litsenziyalangan baholovchiga murojaat qiling.
              </p>
            </div>

            {comparables.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 font-semibold text-foreground">
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
                          <span className="truncate text-sm font-medium text-foreground">{p.title}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" aria-hidden="true" />
                            {p.district} · {p.area} m² · {p.rooms} xona
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-primary">
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
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Chapdagi formani to&apos;ldiring va &laquo;Narxni baholash&raquo; tugmasini
              bosing — AI model mulkingiz qiymatini bir zumda hisoblab beradi.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
