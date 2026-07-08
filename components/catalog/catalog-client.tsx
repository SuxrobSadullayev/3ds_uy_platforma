'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'
import {
  properties,
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  REGIONS,
  type PropertyType,
  type PropertyStatus,
} from '@/lib/data/properties'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'area-desc'

const SORT_LABELS: Record<SortKey, string> = {
  newest: 'Eng yangi',
  'price-asc': 'Narx: arzondan',
  'price-desc': 'Narx: qimmatdan',
  'area-desc': 'Maydon: kattadan',
}

const ROOM_OPTIONS = [1, 2, 3, 4, 5]

export function CatalogClient() {
  const [type, setType] = useState<PropertyType | 'all'>('all')
  const [status, setStatus] = useState<PropertyStatus | 'all'>('all')
  const [region, setRegion] = useState<string>('all')
  const [rooms, setRooms] = useState<number | 'all'>('all')
  const [only3D, setOnly3D] = useState(false)
  const [sort, setSort] = useState<SortKey>('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = properties.filter((p) => p.status !== 'sotilgan')
    if (type !== 'all') list = list.filter((p) => p.type === type)
    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (region !== 'all') list = list.filter((p) => p.region === region)
    if (rooms !== 'all')
      list = list.filter((p) => (rooms === 5 ? p.rooms >= 5 : p.rooms === rooms))
    if (only3D) list = list.filter((p) => p.has3D || p.hasVirtualTour)

    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'area-desc':
        return [...list].sort((a, b) => b.area - a.area)
      default:
        return [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
  }, [type, status, region, rooms, only3D, sort])

  const activeFilterCount =
    (type !== 'all' ? 1 : 0) +
    (status !== 'all' ? 1 : 0) +
    (region !== 'all' ? 1 : 0) +
    (rooms !== 'all' ? 1 : 0) +
    (only3D ? 1 : 0)

  function resetFilters() {
    setType('all')
    setStatus('all')
    setRegion('all')
    setRooms('all')
    setOnly3D(false)
  }

  const selectClass =
    'h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filtrlar
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <div
          className={`w-full flex-wrap items-center gap-2 md:flex md:w-auto ${
            filtersOpen ? 'flex' : 'hidden'
          }`}
        >
          <label className="sr-only" htmlFor="filter-type">
            Mulk turi
          </label>
          <select
            id="filter-type"
            className={selectClass}
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | 'all')}
          >
            <option value="all">Barcha turlar</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-status">
            Holati
          </label>
          <select
            id="filter-status"
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as PropertyStatus | 'all')}
          >
            <option value="all">Barcha holatlar</option>
            {(['sotuvda', 'ijaraga', 'auktsion'] as PropertyStatus[]).map((s) => (
              <option key={s} value={s}>
                {PROPERTY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-region">
            Hudud
          </label>
          <select
            id="filter-region"
            className={selectClass}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="all">Barcha hududlar</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-rooms">
            Xonalar soni
          </label>
          <select
            id="filter-rooms"
            className={selectClass}
            value={rooms}
            onChange={(e) =>
              setRooms(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
          >
            <option value="all">Xonalar: barchasi</option>
            {ROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === 5 ? '5+ xona' : `${n} xona`}
              </option>
            ))}
          </select>

          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={only3D}
              onChange={(e) => setOnly3D(e.target.checked)}
              className="size-4 accent-primary"
            />
            {"Faqat 3D / 360°"}
          </label>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="size-4" aria-hidden="true" />
              Tozalash
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground" htmlFor="sort">
            Saralash:
          </label>
          <select
            id="sort"
            className={selectClass}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} ta mulk topildi
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium text-foreground">Hech narsa topilmadi</p>
          <p className="text-sm text-muted-foreground">
            Filtrlarni o&apos;zgartirib qayta urinib ko&apos;ring
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Filtrlarni tozalash
          </Button>
        </div>
      )}
    </div>
  )
}
