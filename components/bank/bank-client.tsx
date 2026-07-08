'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Banknote,
  FileCheck,
  FileClock,
  Percent,
  Phone,
} from 'lucide-react'
import {
  APPLICATION_STATUS_LABELS,
  calcMonthlyPayment,
  loanApplications,
  loanProducts,
  type ApplicationStatus,
} from '@/lib/data/bank'
import { formatPrice } from '@/lib/data/properties'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  yangi: 'bg-primary/10 text-primary',
  'korib-chiqilmoqda': 'bg-chart-4/15 text-chart-4',
  'pre-approved': 'bg-chart-2/15 text-chart-2',
  tasdiqlandi: 'bg-accent/15 text-accent',
  'rad-etildi': 'bg-destructive/10 text-destructive',
}

const STATUSES: (ApplicationStatus | 'hammasi')[] = [
  'hammasi',
  'yangi',
  'korib-chiqilmoqda',
  'pre-approved',
  'tasdiqlandi',
  'rad-etildi',
]

function creditScoreColor(score: number): string {
  if (score >= 750) return 'text-accent'
  if (score >= 600) return 'text-chart-4'
  return 'text-destructive'
}

export function BankClient() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'hammasi'>('hammasi')

  const filtered = useMemo(
    () =>
      statusFilter === 'hammasi'
        ? loanApplications
        : loanApplications.filter((a) => a.status === statusFilter),
    [statusFilter],
  )

  const approvedTotal = loanApplications
    .filter((a) => a.status === 'tasdiqlandi' || a.status === 'pre-approved')
    .reduce((s, a) => s + a.requestedAmount, 0)
  const pendingCount = loanApplications.filter(
    (a) => a.status === 'yangi' || a.status === 'korib-chiqilmoqda',
  ).length
  const approvalRate = (
    (loanApplications.filter((a) => a.status === 'tasdiqlandi' || a.status === 'pre-approved')
      .length /
      loanApplications.length) *
    100
  ).toFixed(0)

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FileClock, label: 'Kutilayotgan arizalar', value: `${pendingCount} ta` },
          { icon: FileCheck, label: 'Jami arizalar', value: `${loanApplications.length} ta` },
          { icon: Banknote, label: 'Tasdiqlangan kredit hajmi', value: formatPrice(approvedTotal) },
          { icon: Percent, label: 'Tasdiqlash darajasi', value: `${approvalRate}%` },
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

      <section aria-labelledby="applications-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="applications-heading" className="text-sm font-semibold text-foreground">
            Kredit arizalari
          </h2>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Holat filtri">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted',
                )}
              >
                {s === 'hammasi' ? 'Hammasi' : APPLICATION_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Arizachi</th>
                <th scope="col" className="px-4 py-3 font-medium">Mulk</th>
                <th scope="col" className="px-4 py-3 font-medium">{"So'ralgan summa"}</th>
                <th scope="col" className="px-4 py-3 font-medium">Muddat</th>
                <th scope="col" className="px-4 py-3 font-medium">Kredit reyting</th>
                <th scope="col" className="px-4 py-3 font-medium">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-muted">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{app.applicant}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="size-3" aria-hidden="true" />
                      {app.phone}
                    </p>
                  </td>
                  <td className="max-w-52 px-4 py-3">
                    <p className="truncate text-muted-foreground">{app.property}</p>
                    <p className="text-xs text-muted-foreground">
                      {"Boshlang'ich: "}
                      {Math.round((app.downPayment / app.propertyPrice) * 100)}%
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {formatPrice(app.requestedAmount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{app.termYears} yil</td>
                  <td className={cn('px-4 py-3 font-semibold tabular-nums', creditScoreColor(app.creditScore))}>
                    {app.creditScore}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[app.status],
                      )}
                    >
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="text-sm font-semibold text-foreground">
          Kredit mahsulotlari
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {loanProducts.map((product) => {
            const exampleAmount = Math.min(500_000_000, product.maxAmount)
            const monthly = calcMonthlyPayment(exampleAmount, product.rate, product.maxTermYears)
            return (
              <article
                key={product.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    {product.rate}% yillik
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Maks. muddat</dt>
                    <dd className="font-medium text-card-foreground">{product.maxTermYears} yil</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{"Boshlang'ich"}</dt>
                    <dd className="font-medium text-card-foreground">
                      {product.minDownPaymentPercent}% dan
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">500 mln uchun oyiga</dt>
                    <dd className="font-medium text-card-foreground">{formatPrice(Math.round(monthly))}</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
