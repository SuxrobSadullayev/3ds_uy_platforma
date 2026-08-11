'use client'

import { useState } from 'react'
import { CalendarDays, LayoutGrid, List, Percent, Phone, Plus, Users, Wallet } from 'lucide-react'
import { CrmKanban } from '@/components/rieltor/crm-kanban'
import { AppointmentModal } from '@/components/rieltor/appointment-modal'
import {
  deals,
  LEAD_STAGE_LABELS,
  leads,
  MEETING_TYPE_LABELS,
  meetings,
  type LeadStage,
} from '@/lib/data/crm'
import { formatPrice } from '@/lib/data/properties'

export function RieltorClient() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [selectedClientName, setSelectedClientName] = useState('')

  const totalCommission = deals.reduce(
    (s, d) => s + (d.amount * d.commissionRate) / 100,
    0,
  )
  const closedCount = leads.filter((l) => l.stage === 'yopildi').length
  const conversion = ((closedCount / leads.length) * 100).toFixed(0)

  function openAppointment(leadName?: string) {
    if (leadName) setSelectedClientName(leadName)
    setIsAppointmentOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Stat Cards */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Faol mijozlar', value: `${leads.length} ta` },
          { icon: CalendarDays, label: 'Rejalashtirilgan uchrashuvlar', value: `${meetings.length} ta` },
          { icon: Wallet, label: 'Oylik komissiya', value: formatPrice(totalCommission) },
          { icon: Percent, label: 'Konversiya', value: `${conversion}%` },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
            >
              <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {stat.label}
              </dt>
              <dd className="text-xl font-bold text-card-foreground">{stat.value}</dd>
            </div>
          )
        })}
      </dl>

      {/* CRM Section with View Toggle */}
      <section aria-labelledby="crm-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 id="crm-heading" className="text-base font-bold text-foreground">
            Rieltor CRM Boshqaruv Taxtasi
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="size-3.5" aria-hidden="true" />
                <span>Kanban</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="size-3.5" aria-hidden="true" />
                <span>Jadval</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => openAppointment()}
              className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground shadow hover:opacity-90 transition-opacity"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>Yangi Uchrashuv</span>
            </button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <CrmKanban onOpenAppointment={(lead) => openAppointment(lead?.clientName)} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">Mijoz</th>
                  <th scope="col" className="px-4 py-3 font-medium">Qiziqishi</th>
                  <th scope="col" className="px-4 py-3 font-medium">Byudjet</th>
                  <th scope="col" className="px-4 py-3 font-medium">Bosqich</th>
                  <th scope="col" className="px-4 py-3 font-medium">Oxirgi aloqa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-muted">
                    <td className="px-4 py-3">
                      <p className="font-medium text-card-foreground">{lead.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" aria-hidden="true" />
                        {lead.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.interest}</td>
                    <td className="px-4 py-3 font-medium text-card-foreground">
                      {formatPrice(lead.budget)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">
                      {LEAD_STAGE_LABELS[lead.stage]}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Appointment Schedule Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        initialClientName={selectedClientName}
      />
    </div>
  )
}
