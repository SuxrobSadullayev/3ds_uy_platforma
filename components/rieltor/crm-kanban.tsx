'use client'

import { useState } from 'react'
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Plus,
  Phone,
  Search,
  User,
} from 'lucide-react'
import { formatPrice } from '@/lib/data/properties'

export type LeadStatus =
  | 'yangi'
  | 'muloqotda'
  | 'demo'
  | 'bitim'
  | 'yopildi'

export interface LeadItem {
  id: string
  clientName: string
  phone: string
  propertyTitle: string
  amountUzxs: number
  status: LeadStatus
  updatedAt: string
}

const COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'yangi', label: "Yangi So'rov", color: 'border-blue-500/40 bg-blue-500/5 text-blue-600' },
  { id: 'muloqotda', label: 'Muloqotda', color: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-600' },
  { id: 'demo', label: "Demo Ko'rsatish", color: 'border-purple-500/40 bg-purple-500/5 text-purple-600' },
  { id: 'bitim', label: 'Bitim Jarayonida', color: 'border-orange-500/40 bg-orange-500/5 text-orange-600' },
  { id: 'yopildi', label: 'Muvaffaqiyatli Yopildi', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600' },
]

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    clientName: 'Javohir Ergashev',
    phone: '+998 90 987 65 43',
    propertyTitle: "Mirzo Ulug'bek 3 xonali kvartira",
    amountUzxs: 1_150_000_000,
    status: 'yangi',
    updatedAt: 'Bugun 10:30',
  },
  {
    id: 'lead-2',
    clientName: 'Nigora Malikova',
    phone: '+998 93 123 11 22',
    propertyTitle: 'Qibray 2 qavatli hovli uy',
    amountUzxs: 2_800_000_000,
    status: 'muloqotda',
    updatedAt: 'Kecha 16:45',
  },
  {
    id: 'lead-3',
    clientName: 'Sardor Rahimxon',
    phone: '+998 97 555 44 33',
    propertyTitle: 'Tashkent City A-klass ofis',
    amountUzxs: 45_000_000,
    status: 'demo',
    updatedAt: 'Bugun 14:00',
  },
  {
    id: 'lead-4',
    clientName: 'Farrux Zokirov',
    phone: '+998 99 888 77 66',
    propertyTitle: 'Sergeli turar joy majmuasi',
    amountUzxs: 780_000_000,
    status: 'bitim',
    updatedAt: '2 kun oldin',
  },
  {
    id: 'lead-5',
    clientName: 'Shahnoza Umarova',
    phone: '+998 91 222 33 44',
    propertyTitle: 'Yunusobod Penthaus',
    amountUzxs: 4_500_000_000,
    status: 'yopildi',
    updatedAt: '3 kun oldin',
  },
]

export function CrmKanban({ onOpenAppointment }: { onOpenAppointment?: (lead?: LeadItem) => void }) {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS)
  const [search, setSearch] = useState('')

  const filtered = leads.filter(
    (l) =>
      l.clientName.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search),
  )

  function moveLead(id: string, direction: 'prev' | 'next') {
    const order: LeadStatus[] = ['yangi', 'muloqotda', 'demo', 'bitim', 'yopildi']
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== id) return lead
        const currentIndex = order.indexOf(lead.status)
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
        if (nextIndex >= 0 && nextIndex < order.length) {
          return { ...lead, status: order[nextIndex] }
        }
        return lead
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mijoz ismi yoki mulk bo'yicha qidirish..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {onOpenAppointment && (
          <button
            type="button"
            onClick={() => onOpenAppointment()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Uchrashuv belgilash</span>
          </button>
        )}
      </div>

      {/* Kanban Board Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[1100px] gap-4">
          {COLUMNS.map((col) => {
            const colLeads = filtered.filter((l) => l.status === col.id)
            return (
              <div
                key={col.id}
                className="flex flex-1 flex-col rounded-2xl border border-border bg-muted/20 p-3"
              >
                {/* Column Title */}
                <div className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-bold ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-background text-[11px]">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="mt-3 flex flex-1 flex-col gap-3">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="group flex flex-col justify-between gap-2.5 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-card-foreground flex items-center gap-1">
                            <User className="size-3.5 text-primary" aria-hidden="true" />
                            {lead.clientName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{lead.updatedAt}</span>
                        </div>

                        <p className="mt-1 text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          <Phone className="size-3" aria-hidden="true" />
                          {lead.phone}
                        </p>

                        <p className="mt-2 text-xs font-medium text-foreground line-clamp-1 flex items-center gap-1">
                          <Building2 className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                          {lead.propertyTitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
                        <span className="font-bold text-primary">{formatPrice(lead.amountUzxs)}</span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveLead(lead.id, 'prev')}
                            disabled={col.id === 'yangi'}
                            className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                            title="Oldingi bosqich"
                          >
                            <ChevronLeft className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveLead(lead.id, 'next')}
                            disabled={col.id === 'yopildi'}
                            className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
                            title="Keyingi bosqich"
                          >
                            <ChevronRight className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                      Mijozlar yo&apos;q
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
