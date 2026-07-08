'use client'

import { useState } from 'react'
import {
  Building2,
  CheckCircle2,
  FileClock,
  Gavel,
  Handshake,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { AdminRevenueChart } from '@/components/admin/admin-revenue-chart'
import {
  auditLog,
  moderationQueue,
  platformStats,
  platformUsers,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  type ModerationStatus,
  type UserStatus,
} from '@/lib/data/admin'

type Tab = 'umumiy' | 'foydalanuvchilar' | 'moderatsiya' | 'audit'

const TABS: { id: Tab; label: string }[] = [
  { id: 'umumiy', label: 'Umumiy' },
  { id: 'foydalanuvchilar', label: 'Foydalanuvchilar' },
  { id: 'moderatsiya', label: 'Moderatsiya' },
  { id: 'audit', label: 'Audit log' },
]

const STATUS_BADGE: Record<UserStatus, string> = {
  faol: 'bg-accent/10 text-accent',
  bloklangan: 'bg-destructive/10 text-destructive',
  kutmoqda: 'bg-primary/10 text-primary',
}

export function AdminClient() {
  const [tab, setTab] = useState<Tab>('umumiy')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Admin bo'limlari">
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

      {tab === 'umumiy' && <OverviewTab />}
      {tab === 'foydalanuvchilar' && <UsersTab />}
      {tab === 'moderatsiya' && <ModerationTab />}
      {tab === 'audit' && <AuditTab />}
    </div>
  )
}

function OverviewTab() {
  const cards = [
    {
      icon: Users,
      label: 'Jami foydalanuvchilar',
      value: platformStats.totalUsers.toLocaleString('uz-UZ'),
      change: platformStats.usersChange,
    },
    {
      icon: Wallet,
      label: 'Oylik daromad',
      value: platformStats.monthlyRevenue,
      change: platformStats.revenueChange,
    },
    {
      icon: Building2,
      label: "Faol e'lonlar",
      value: platformStats.activeListings.toLocaleString('uz-UZ'),
      change: platformStats.listingsChange,
    },
    {
      icon: Handshake,
      label: 'Yakunlangan bitimlar',
      value: platformStats.completedDeals.toString(),
      change: platformStats.dealsChange,
    },
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
                <span className="text-xs font-semibold text-accent">{card.change}</span>
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section
          aria-labelledby="revenue-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="revenue-heading" className="text-sm font-semibold text-card-foreground">
            Daromad manbalari — 2026 (mln so&apos;m)
          </h2>
          <div className="mt-4">
            <AdminRevenueChart />
          </div>
        </section>

        <section
          aria-labelledby="alerts-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="alerts-heading" className="text-sm font-semibold text-card-foreground">
            Tizim holati
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-secondary-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Uptime: 99.94% — SLA maqsadi bajarilmoqda
            </li>
            <li className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-secondary-foreground">
              <FileClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {moderationQueue.length} ta e&apos;lon moderatsiya kutmoqda
            </li>
            <li className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-secondary-foreground">
              <Gavel className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />4 ta faol
              auktsion, keyingisi: bugun 18:00
            </li>
            <li className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-secondary-foreground">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              1 ta kompaniya bloklangan — KYC firibgarlik gumoni
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function UsersTab() {
  const [query, setQuery] = useState('')
  const [statuses, setStatuses] = useState<Record<string, UserStatus>>(
    Object.fromEntries(platformUsers.map((u) => [u.id, u.status])),
  )

  const filtered = platformUsers.filter((u) => {
    const q = query.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      USER_ROLE_LABELS[u.role].toLowerCase().includes(q)
    )
  })

  function toggleBlock(id: string) {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'bloklangan' ? 'faol' : 'bloklangan',
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ism, email yoki rol bo'yicha qidirish..."
          aria-label="Foydalanuvchilarni qidirish"
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">
                Foydalanuvchi
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Rol
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                KYC
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Holat
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Oxirgi faollik
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Amal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => {
              const status = statuses[u.id]
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-card-foreground">{USER_ROLE_LABELS[u.role]}</td>
                  <td className="px-4 py-3">
                    {u.kycVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                        <CheckCircle2 className="size-3.5" aria-hidden="true" /> Tasdiqlangan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <XCircle className="size-3.5" aria-hidden="true" /> Yo&apos;q
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}
                    >
                      {USER_STATUS_LABELS[status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastActive}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleBlock(u.id)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                        status === 'bloklangan'
                          ? 'bg-accent/10 text-accent hover:bg-accent/20'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      }`}
                    >
                      {status === 'bloklangan' ? 'Faollashtirish' : 'Bloklash'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Qidiruv bo&apos;yicha foydalanuvchi topilmadi
          </p>
        )}
      </div>
    </div>
  )
}

function ModerationTab() {
  const [decisions, setDecisions] = useState<Record<string, ModerationStatus>>({})

  function decide(id: string, decision: ModerationStatus) {
    setDecisions((prev) => ({ ...prev, [id]: decision }))
  }

  const pendingCount = moderationQueue.filter((m) => !decisions[m.id]).length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {pendingCount} ta e&apos;lon qaror kutmoqda. Tasdiqlangan e&apos;lonlar darhol katalogda
        ko&apos;rinadi.
      </p>
      <ul className="flex flex-col gap-3">
        {moderationQueue.map((item) => {
          const decision = decisions[item.id]
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-card-foreground">{item.propertyTitle}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.company} · {item.type} · {item.price} · {item.submittedAt}
                </p>
                {item.flags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.flags.map((flag) => (
                      <span
                        key={flag}
                        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                      >
                        <ShieldAlert className="size-3" aria-hidden="true" />
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {decision === 'tasdiqlangan' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" /> Tasdiqlandi
                  </span>
                )}
                {decision === 'rad-etilgan' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                    <XCircle className="size-3.5" aria-hidden="true" /> Rad etildi
                  </span>
                )}
                {!decision && (
                  <>
                    <button
                      type="button"
                      onClick={() => decide(item.id, 'tasdiqlangan')}
                      className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                    >
                      Tasdiqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(item.id, 'rad-etilgan')}
                      className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
                    >
                      Rad etish
                    </button>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const SEVERITY_STYLE: Record<string, string> = {
  info: 'bg-primary/10 text-primary',
  warning: 'bg-chart-4/20 text-foreground',
  critical: 'bg-destructive/10 text-destructive',
}

const SEVERITY_LABEL: Record<string, string> = {
  info: 'Info',
  warning: 'Ogohlantirish',
  critical: 'Kritik',
}

function AuditTab() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th scope="col" className="px-4 py-3 font-medium">
              Vaqt
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Foydalanuvchi
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Amal
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              IP manzil
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Daraja
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {auditLog.map((entry) => (
            <tr key={entry.id}>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                {entry.timestamp}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-card-foreground">{entry.user}</p>
                <p className="text-xs text-muted-foreground">{USER_ROLE_LABELS[entry.role]}</p>
              </td>
              <td className="px-4 py-3 text-card-foreground">{entry.action}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                {entry.ip}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLE[entry.severity]}`}
                >
                  {SEVERITY_LABEL[entry.severity]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
