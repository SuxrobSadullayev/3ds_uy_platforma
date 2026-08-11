'use client'

import React, { useState } from 'react'
import { Calendar, ChevronRight, MessageSquare, Phone, Plus, User } from 'lucide-react'

export interface DealItem {
  id: string
  clientName: string
  phone: string
  propertyTitle: string
  amount: string
  stage: 'yangi' | 'muloqot' | 'demo' | 'bitim' | 'yopildi'
  date: string
}

const INITIAL_DEALS: DealItem[] = [
  { id: '1', clientName: 'Jasur Bekov', phone: '+998 90 111 22 33', propertyTitle: 'Chilonzor 3 xonali', amount: '850,000,000 soʻm', stage: 'yangi', date: 'Bugun' },
  { id: '2', clientName: 'Malika Aliyeve', phone: '+998 93 444 55 66', propertyTitle: 'Yashnobod Yangi Uy', amount: '1,200,000,000 soʻm', stage: 'muloqot', date: 'Kecha' },
  { id: '3', clientName: 'Sardor Qodirov', phone: '+998 97 777 88 99', propertyTitle: 'Mirzo Ulugbek Penthouse', amount: '2,100,000,000 soʻm', stage: 'demo', date: '10-Avg' },
  { id: '4', clientName: 'Nodira Azimova', phone: '+998 94 222 33 44', propertyTitle: 'Yakkasaroy Ofis', amount: '950,000,000 soʻm', stage: 'bitim', date: '08-Avg' },
  { id: '5', clientName: 'Temur Isoev', phone: '+998 91 555 66 77', propertyTitle: 'Sergeli Kvartira', amount: '620,000,000 soʻm', stage: 'yopildi', date: '01-Avg' },
]

const STAGES = [
  { id: 'yangi', name: 'Yangi Soʻrov', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'muloqot', name: 'Muloqotda', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { id: 'demo', name: 'Demo Koʻrsatish', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'bitim', name: 'Bitim Jarayonida', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  { id: 'yopildi', name: 'Muvaffaqiyatli Yopildi', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
]

interface CrmKanbanProps {
  onOpenAppointmentModal: (clientName?: string) => void
}

export function CrmKanban({ onOpenAppointmentModal }: CrmKanbanProps) {
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS)

  const moveDeal = (id: string, direction: 'next' | 'prev') => {
    const stageKeys = STAGES.map((s) => s.id)
    setDeals((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const currentIndex = stageKeys.indexOf(item.stage)
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
        if (nextIndex >= 0 && nextIndex < stageKeys.length) {
          return { ...item, stage: stageKeys[nextIndex] as DealItem['stage'] }
        }
        return item
      })
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mijozlar Kanban Taxtasi</h2>
          <p className="text-xs text-muted-foreground">Mijozlar bilan savdo quvurini (Sales Pipeline) boshqaring</p>
        </div>
        <button
          onClick={() => onOpenAppointmentModal()}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yangi Uchrashuv
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id)
          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-accent/20 p-3 min-w-[240px]"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${stage.color}`}>
                  {stage.name}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{stageDeals.length}</span>
              </div>

              <div className="flex-1 space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="rounded-xl border border-border/80 bg-background p-3 shadow-sm hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        <User className="h-4 w-4 text-primary" />
                        {deal.clientName}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{deal.date}</span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate">{deal.propertyTitle}</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{deal.amount}</p>

                    <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                      <a href={`tel:${deal.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <Phone className="h-3 w-3" />
                        {deal.phone}
                      </a>
                      <button
                        onClick={() => onOpenAppointmentModal(deal.clientName)}
                        className="flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        <Calendar className="h-3 w-3" />
                        Demo
                      </button>
                    </div>

                    <div className="flex justify-between gap-1 pt-1">
                      {stage.id !== 'yangi' && (
                        <button
                          onClick={() => moveDeal(deal.id, 'prev')}
                          className="w-full rounded-lg border border-input py-1 text-[10px] text-muted-foreground hover:bg-accent"
                        >
                          ◀ Orqaga
                        </button>
                      )}
                      {stage.id !== 'yopildi' && (
                        <button
                          onClick={() => moveDeal(deal.id, 'next')}
                          className="w-full rounded-lg border border-primary/30 bg-primary/5 py-1 text-[10px] font-medium text-primary hover:bg-primary/10"
                        >
                          Oldinga ▶
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
                    Eʼlon yoʻq
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
