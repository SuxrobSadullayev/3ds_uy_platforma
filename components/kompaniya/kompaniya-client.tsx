'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Building2,
  Eye,
  FileImage,
  FileVideo,
  MessageCircle,
  Percent,
  Plus,
  UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatPrice,
  properties,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  REGIONS,
  type PropertyType,
} from '@/lib/data/properties'

type Tab = 'elonlar' | 'yangi' | 'statistika'

const TABS: { id: Tab; label: string }[] = [
  { id: 'elonlar', label: "E'lonlarim" },
  { id: 'yangi', label: "Yangi e'lon" },
  { id: 'statistika', label: 'Statistika' },
]

export function KompaniyaClient() {
  const [tab, setTab] = useState<Tab>('elonlar')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Kompaniya bo'limlari">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'elonlar' && <ListingsTab onNew={() => setTab('yangi')} />}
      {tab === 'yangi' && <NewListingTab />}
      {tab === 'statistika' && <StatsTab />}
    </div>
  )
}

function ListingsTab({ onNew }: { onNew: () => void }) {
  const companyListings = properties.filter((p) => p.seller.type === 'kompaniya')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {companyListings.length} ta faol e&apos;lon
        </p>
        <Button size="sm" onClick={onNew}>
          <Plus className="size-4" aria-hidden="true" />
          Yangi e&apos;lon
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">
                Mulk
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Turi
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Narx
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Holat
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                3D
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Amal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {companyListings.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-card-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.district} · {p.area} m²
                  </p>
                </td>
                <td className="px-4 py-3 text-card-foreground">
                  {PROPERTY_TYPE_LABELS[p.type]}
                </td>
                <td className="px-4 py-3 font-semibold text-primary">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    {PROPERTY_STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {p.has3D ? 'Mavjud' : "Yo'q"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/mulklar/${p.id}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Ko&apos;rish
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const MEDIA_TYPES = [
  { icon: FileImage, label: 'Rasm', hint: 'JPG/PNG, max 20MB' },
  { icon: FileVideo, label: 'Video', hint: 'MP4, max 500MB' },
  { icon: Box, label: '3D model', hint: '.glb/.gltf, max 200MB' },
]

function NewListingTab() {
  const [submitted, setSubmitted] = useState(false)
  const [type, setType] = useState<PropertyType>('kvartira')
  const [rentToOwn, setRentToOwn] = useState(false)
  const [isConstruction, setIsConstruction] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-card-foreground">
          E&apos;lon moderatsiyaga yuborildi
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          E&apos;loningiz Super Admin tomonidan ko&apos;rib chiqiladi. Tasdiqlangandan so&apos;ng
          katalogda paydo bo&apos;ladi. Odatda bu 24 soat ichida amalga oshiriladi.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Yana e&apos;lon qo&apos;shish
        </Button>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Asosiy ma&apos;lumotlar</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-card-foreground">E&apos;lon sarlavhasi</span>
            <input
              required
              type="text"
              placeholder="Masalan: Yangi 3 xonali kvartira — Chilonzor"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Mulk turi</span>
            <select
              value={type}
              onChange={(e) => {
                const v = e.target.value as PropertyType
                setType(v)
                setIsConstruction(v === 'qurilish')
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((t) => (
                <option key={t} value={t}>
                  {PROPERTY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Hudud</span>
            <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-card-foreground">Manzil</span>
            <input
              required
              type="text"
              placeholder="Tuman, ko'cha, uy raqami"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Maydon (m²)</span>
            <input
              required
              type="number"
              min={1}
              placeholder="88"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Xonalar soni</span>
            <input
              required
              type="number"
              min={1}
              placeholder="3"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Qavat</span>
            <input
              type="number"
              min={1}
              placeholder="7"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Qurilgan yili</span>
            <input
              type="number"
              min={1900}
              max={2030}
              placeholder="2025"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Media yuklash</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          360° virtual tour uchun Matterport yoki CloudPano havolasini ham qo&apos;shishingiz
          mumkin.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MEDIA_TYPES.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.label}
                type="button"
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-card-foreground">{m.label}</span>
                <span className="text-xs text-muted-foreground">{m.hint}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <UploadCloud className="size-3.5" aria-hidden="true" /> Yuklash
                </span>
              </button>
            )
          })}
        </div>
        <label className="mt-4 flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-card-foreground">360° virtual tour havolasi</span>
          <input
            type="url"
            placeholder="https://my.matterport.com/show/?m=..."
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Narx va to&apos;lov</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">To&apos;liq narx (so&apos;m)</span>
            <input
              required
              type="number"
              min={0}
              placeholder="1 150 000 000"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-card-foreground">Chegirma (%, ixtiyoriy)</span>
            <input
              type="number"
              min={0}
              max={50}
              placeholder="5"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" className="size-4 accent-primary" />
            <span className="text-card-foreground">Ipoteka bilan sotish mumkin</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" className="size-4 accent-primary" />
            <span className="text-card-foreground">Bo&apos;lib to&apos;lash mavjud</span>
          </label>
        </div>
      </section>

      {isConstruction && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-card-foreground">Qurilish bosqichi</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-card-foreground">Bosqich nomi</span>
              <input
                type="text"
                placeholder="Monolit ishlari"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-card-foreground">Tayyorlik foizi (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="45"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-card-foreground">Rent-to-Own rejimi</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Mulkni ijara orqali sotib olish imkoniyati bilan taklif qilish
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={rentToOwn}
            aria-label="Rent-to-Own rejimini yoqish"
            onClick={() => setRentToOwn(!rentToOwn)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              rentToOwn ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${
                rentToOwn ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
        {rentToOwn && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-card-foreground">Oylik to&apos;lov (so&apos;m)</span>
              <input
                type="number"
                min={0}
                placeholder="12 000 000"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-card-foreground">Minimal muddat (oy)</span>
              <input
                type="number"
                min={6}
                placeholder="36"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-card-foreground">Narx qulflash sanasi</span>
              <input
                type="date"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-card-foreground">Tavsif</span>
          <textarea
            required
            rows={4}
            placeholder="Mulk haqida batafsil ma'lumot yozing..."
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg">
          Moderatsiyaga yuborish
        </Button>
      </div>
    </form>
  )
}

const VIEW_STATS = [
  { property: "Yangi 3 xonali kvartira — Mirzo Ulug'bek", views: 4820, inquiries: 41, conversion: '0.85%' },
  { property: 'Yangi turar joy majmuasi — Sergeli', views: 3910, inquiries: 58, conversion: '1.48%' },
  { property: 'A-klass ofis — Tashkent City', views: 2140, inquiries: 19, conversion: '0.89%' },
  { property: 'Premium penthaus — Yunusobod', views: 1580, inquiries: 12, conversion: '0.76%' },
]

function StatsTab() {
  const cards = [
    { icon: Building2, label: "Faol e'lonlar", value: '18 ta' },
    { icon: Eye, label: "Oylik ko'rishlar", value: '12,450', change: '+18%' },
    { icon: MessageCircle, label: "Yangi so'rovlar", value: '37 ta' },
    { icon: Percent, label: 'Konversiya', value: '4.2%', change: '+0.6%' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
            >
              <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {card.label}
              </dt>
              <dd className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-card-foreground">{card.value}</span>
                {card.change && (
                  <span className="text-xs font-semibold text-accent">{card.change}</span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">E&apos;lonlar bo&apos;yicha ko&apos;rish statistikasi</caption>
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">
                Mulk
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Ko&apos;rishlar
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                So&apos;rovlar
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Konversiya
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {VIEW_STATS.map((s) => (
              <tr key={s.property}>
                <td className="px-4 py-3 font-medium text-card-foreground">{s.property}</td>
                <td className="px-4 py-3 text-card-foreground">
                  {s.views.toLocaleString('uz-UZ')}
                </td>
                <td className="px-4 py-3 text-card-foreground">{s.inquiries}</td>
                <td className="px-4 py-3 font-semibold text-accent">{s.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
