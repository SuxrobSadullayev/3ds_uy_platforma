'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Building2,
  Eye,
  MessageCircle,
  Percent,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyWizardModal } from '@/components/kompaniya/property-wizard-modal'
import {
  formatPrice,
  properties,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
} from '@/lib/data/properties'

type Tab = 'elonlar' | 'statistika'

const TABS: { id: Tab; label: string }[] = [
  { id: 'elonlar', label: "E'lonlarim" },
  { id: 'statistika', label: 'Statistika' },
]

export function KompaniyaClient() {
  const [tab, setTab] = useState<Tab>('elonlar')
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        <Button size="sm" onClick={() => setIsWizardOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Yangi e&apos;lon berish (Wizard)
        </Button>
      </div>

      {tab === 'elonlar' && <ListingsTab onNew={() => setIsWizardOpen(true)} />}
      {tab === 'statistika' && <StatsTab />}

      {/* Multistep Property Wizard Modal */}
      <PropertyWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={(data) => {
          console.log('New Property Submitted:', data)
        }}
      />
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
