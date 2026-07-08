'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Building2,
  Eye,
  Gavel,
  Heart,
  LineChart,
  MessageCircle,
  Percent,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { MarketChart } from '@/components/dashboard/market-chart'
import { formatPrice, properties } from '@/lib/data/properties'

type Role = 'xaridor' | 'investor' | 'kompaniya' | 'admin'

const ROLE_LABELS: Record<Role, string> = {
  xaridor: 'Xaridor',
  investor: 'Investor',
  kompaniya: 'Qurilish kompaniya',
  admin: 'Super Admin',
}

interface Stat {
  icon: typeof Eye
  label: string
  value: string
  change?: string
}

const ROLE_STATS: Record<Role, Stat[]> = {
  xaridor: [
    { icon: Heart, label: 'Sevimlilar', value: '6 ta' },
    { icon: Eye, label: "Ko'rilgan mulklar", value: '24 ta' },
    { icon: MessageCircle, label: 'Faol chatlar', value: '3 ta' },
    { icon: Bell, label: 'AI Match takliflar', value: '5 ta yangi' },
  ],
  investor: [
    { icon: Wallet, label: 'Portfolio qiymati', value: "8.4 mlrd so'm", change: '+6.2%' },
    { icon: TrendingUp, label: "O'rtacha ROI", value: '14.8%', change: '+1.1%' },
    { icon: Bell, label: 'AI Kuzatuvda', value: '12 mulk' },
    { icon: LineChart, label: 'Oylik daromad', value: "94 mln so'm", change: '+3.4%' },
  ],
  kompaniya: [
    { icon: Building2, label: "Faol e'lonlar", value: '18 ta' },
    { icon: Eye, label: "Oylik ko'rishlar", value: '12,450', change: '+18%' },
    { icon: MessageCircle, label: "Yangi so'rovlar", value: '37 ta' },
    { icon: Percent, label: 'Konversiya', value: '4.2%', change: '+0.6%' },
  ],
  admin: [
    { icon: Users, label: 'Jami foydalanuvchilar', value: '48,210', change: '+2,140' },
    { icon: Wallet, label: 'Oylik daromad', value: "1.2 mlrd so'm", change: '+11%' },
    { icon: Gavel, label: 'Faol auktsionlar', value: '4 ta' },
    { icon: ShieldCheck, label: 'Moderatsiya kutmoqda', value: '23 e\u2019lon' },
  ],
}

const ROLE_TASKS: Record<Role, string[]> = {
  xaridor: [
    "Yunusobod penthaus bo'yicha uchrashuv — ertaga 15:00",
    "Sergeli 2-xonali kvartira narxi 3% ga tushdi",
    'AI Match: sizga mos 5 ta yangi mulk topildi',
  ],
  investor: [
    "Chilonzor do'kon narxi +5.2% o'sdi — sotish tavsiya etiladi",
    'Haftalik bozor xulosasi tayyor: Toshkent +1.8%',
    'Samarqand auktsioni 2 soatdan keyin boshlanadi',
  ],
  kompaniya: [
    "3 ta yangi e'lon moderatsiyadan o'tdi",
    "Golden House majmuasi bo'yicha 12 ta yangi so'rov",
    "Premium listing muddati 5 kundan keyin tugaydi",
  ],
  admin: [
    '23 ta e\u2019lon moderatsiya kutmoqda',
    "Murad Buildings obunani Pro tarifga o'zgartirdi",
    'Kunlik backup muvaffaqiyatli yakunlandi (04:00)',
  ],
}

export function DashboardClient() {
  const [role, setRole] = useState<Role>('xaridor')
  const stats = ROLE_STATS[role]
  const tasks = ROLE_TASKS[role]
  const favorites = properties.slice(0, 3)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Kabinet roli">
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={role === r}
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              role === r
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {ROLE_LABELS[r]}
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
          Demo rejim — autentifikatsiya keyingi bosqichda ulanadi
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
              <dd className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-card-foreground">{stat.value}</span>
                {stat.change && (
                  <span className="text-xs font-semibold text-accent">{stat.change}</span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="market-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <h2 id="market-heading" className="text-sm font-semibold text-card-foreground">
              Bozor tahlili — Toshkent, o&apos;rtacha m² narxi (mln so&apos;m)
            </h2>
            <span className="text-xs font-semibold text-accent">+20.2% / yil</span>
          </div>
          <div className="mt-4">
            <MarketChart />
          </div>
        </section>

        <section
          aria-labelledby="tasks-heading"
          className="rounded-xl border border-border bg-card p-5"
        >
          <h2 id="tasks-heading" className="text-sm font-semibold text-card-foreground">
            Bildirishnomalar
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {tasks.map((task) => (
              <li
                key={task}
                className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground"
              >
                <Bell className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-snug">{task}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-sm font-semibold text-foreground">
          {role === 'kompaniya' || role === 'admin'
            ? "So'nggi e'lonlar"
            : role === 'investor'
              ? 'Portfolio mulklari'
              : 'Sevimli mulklar'}
        </h2>
        <ul className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
          {favorites.map((p) => (
            <li key={p.id}>
              <Link
                href={`/mulklar/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.district}, {p.region} — {p.area} m²
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">
                  {formatPrice(p.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
