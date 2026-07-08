'use client'

import { useState } from 'react'
import { CalendarDays, Percent, Phone, Users, Wallet } from 'lucide-react'
import {
  deals,
  LEAD_STAGE_LABELS,
  leads,
  MEETING_TYPE_LABELS,
  meetings,
  type LeadStage,
} from '@/lib/data/crm'
import { formatPrice } from '@/lib/data/properties'

const STAGE_STYLES: Record<LeadStage, string> = {
  yangi: 'bg-primary/10 text-primary',
  aloqada: 'bg-chart-2/15 text-chart-2',
  korish: 'bg-chart-4/15 text-chart-4',
  muzokara: 'bg-chart-5/15 text-chart-5',
  yopildi: 'bg-accent/15 text-accent',
}

const STAGES: (LeadStage | 'hammasi')[] = [
  'hammasi',
  'yangi',
  'aloqada',
  'korish',
  'muzokara',
  'yopildi',
]

export function RieltorClient() {
  const [stageFilter, setStageFilter] = useState<LeadStage | 'hammasi'>('hammasi')

  const filteredLeads =
    stageFilter === 'hammasi' ? leads : leads.filter((l) => l.stage === stageFilter)

  const totalCommission = deals.reduce(
    (s, d) => s + (d.amount * d.commissionRate) / 100,
    0,
  )
  const closedCount = leads.filter((l) => l.stage === 'yopildi').length
  const conversion = ((closedCount / leads.length) * 100).toFixed(0)

  return (
    <div className="flex flex-col gap-8">
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

      <section aria-labelledby="crm-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="crm-heading" className="text-sm font-semibold text-foreground">
            Mijozlar CRM
          </h2>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Bosqich filtri">
            {STAGES.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={stageFilter === s}
                onClick={() => setStageFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  stageFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {s === 'hammasi' ? 'Hammasi' : LEAD_STAGE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
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
              {filteredLeads.map((lead) => (
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
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_STYLES[lead.stage]}`}
                    >
                      {LEAD_STAGE_LABELS[lead.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.lastContact}</td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Bu bosqichda mijozlar yo&apos;q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          aria-labelledby="calendar-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="calendar-heading" className="text-sm font-semibold text-card-foreground">
            Taqvim — yaqin uchrashuvlar
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {meetings.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-bold">{m.time}</span>
                  <span className="text-[10px]">{m.date.slice(5)}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary-foreground">
                    {m.client} — {MEETING_TYPE_LABELS[m.type]}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{m.property}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="commission-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="commission-heading" className="text-sm font-semibold text-card-foreground">
            Komission hisob — yopilgan bitimlar
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {deals.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-secondary p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary-foreground">
                    {d.property}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.client} — {formatPrice(d.amount)} ({d.commissionRate}%)
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-accent">
                  +{formatPrice((d.amount * d.commissionRate) / 100)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Jami komissiya</span>
            <span className="font-bold text-card-foreground">
              {formatPrice(totalCommission)}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
