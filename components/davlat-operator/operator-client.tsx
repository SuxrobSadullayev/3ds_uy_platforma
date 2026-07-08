'use client'

import { useState } from 'react'
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  FileText,
  Gavel,
  Pause,
  Play,
  Plus,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  auctions,
  AUCTION_STATUS_LABELS,
  AUCTION_TYPE_LABELS,
  type Auction,
  type AuctionStatus,
} from '@/lib/data/auctions'
import { formatPrice } from '@/lib/data/properties'

type Tab = 'auktsionlar' | 'kyc' | 'goliblar' | 'hisobot'

const TABS: { id: Tab; label: string }[] = [
  { id: 'auktsionlar', label: 'Auktsionlar' },
  { id: 'kyc', label: 'KYC arizalar' },
  { id: 'goliblar', label: "G'oliblar" },
  { id: 'hisobot', label: 'Hisobot' },
]

interface KycApplication {
  id: string
  name: string
  document: string
  auctionTitle: string
  depositPaid: boolean
  status: 'kutilmoqda' | 'tasdiqlangan' | 'rad'
}

const initialKyc: KycApplication[] = [
  {
    id: 'k-001',
    name: 'Jasur Toshpulatov',
    document: 'AB 1234567 (Passport)',
    auctionTitle: 'Sobiq maktab binosi — Samarqand',
    depositPaid: true,
    status: 'kutilmoqda',
  },
  {
    id: 'k-002',
    name: '"Orient Invest" MChJ',
    document: 'STIR 305 412 887',
    auctionTitle: "Ma'muriy bino — Buxoro markazi",
    depositPaid: true,
    status: 'kutilmoqda',
  },
  {
    id: 'k-003',
    name: 'Nodira Ismoilova',
    document: 'AC 7654321 (ID karta)',
    auctionTitle: 'Yer maydoni (0.8 ga) — Toshkent viloyati',
    depositPaid: false,
    status: 'kutilmoqda',
  },
  {
    id: 'k-004',
    name: '"Bunyodkor Qurilish" MChJ',
    document: 'STIR 301 998 234',
    auctionTitle: 'Sobiq zavod ombori — Andijon',
    depositPaid: true,
    status: 'tasdiqlangan',
  },
]

interface Winner {
  id: string
  auctionTitle: string
  winnerName: string
  finalBid: number
  status: 'tasdiq-kutmoqda' | 'tasdiqlangan'
  docsReady: boolean
}

const initialWinners: Winner[] = [
  {
    id: 'w-001',
    auctionTitle: "Tijorat binosi — Farg'ona shahri",
    winnerName: '"Fergana Capital" MChJ',
    finalBid: 4_750_000_000,
    status: 'tasdiq-kutmoqda',
    docsReady: true,
  },
  {
    id: 'w-002',
    auctionTitle: 'Sobiq avtobaza — Namangan',
    winnerName: 'Bekzod Alimov',
    finalBid: 2_150_000_000,
    status: 'tasdiqlangan',
    docsReady: true,
  },
]

const STATUS_STYLES: Record<AuctionStatus, string> = {
  jonli: 'bg-primary/10 text-primary',
  kutilmoqda: 'bg-accent/10 text-accent-foreground',
  yakunlangan: 'bg-muted text-muted-foreground',
}

export function OperatorClient() {
  const [tab, setTab] = useState<Tab>('auktsionlar')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Gavel} label="Faol auktsionlar" value="2 ta" />
        <StatCard icon={Users} label="KYC kutmoqda" value="3 ariza" />
        <StatCard icon={Trophy} label="Tasdiq kutayotgan g'olib" value="1 ta" />
        <StatCard icon={Wallet} label="Oylik tushum" value="12.4 mlrd so'm" />
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Operator bo'limlari">
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

      {tab === 'auktsionlar' && <AuctionsTab />}
      {tab === 'kyc' && <KycTab />}
      {tab === 'goliblar' && <WinnersTab />}
      {tab === 'hisobot' && <ReportTab />}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gavel
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground md:text-base">{value}</p>
      </div>
    </div>
  )
}

function AuctionsTab() {
  const [items, setItems] = useState<Auction[]>(auctions)

  function toggleStatus(id: string) {
    setItems((prev) =>
      prev.map((a) => {
        if (a.id !== id || a.status === 'yakunlangan') return a
        return { ...a, status: a.status === 'jonli' ? 'kutilmoqda' : 'jonli' }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Auktsionlar boshqaruvi</h2>
        <Button size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Yangi auktsion e&apos;lon qilish
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Auktsion</th>
              <th className="px-4 py-3 font-medium">Turi</th>
              <th className="px-4 py-3 font-medium">Joriy taklif</th>
              <th className="px-4 py-3 font-medium">Ishtirokchilar</th>
              <th className="px-4 py-3 font-medium">Holati</th>
              <th className="px-4 py-3 font-medium">Amal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="max-w-[260px] px-4 py-3">
                  <p className="truncate font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.organizer}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {AUCTION_TYPE_LABELS[a.type]}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatPrice(a.currentBid)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.bidders} ta</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status]}`}
                  >
                    {AUCTION_STATUS_LABELS[a.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {a.status !== 'yakunlangan' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(a.id)}
                    >
                      {a.status === 'jonli' ? (
                        <>
                          <Pause className="size-4" aria-hidden="true" />
                          To&apos;xtatish
                        </>
                      ) : (
                        <>
                          <Play className="size-4" aria-hidden="true" />
                          Boshlash
                        </>
                      )}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Yakunlangan</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KycTab() {
  const [apps, setApps] = useState<KycApplication[]>(initialKyc)

  function decide(id: string, status: 'tasdiqlangan' | 'rad') {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">
        Ishtirokchi KYC arizalari
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{app.name}</p>
                <p className="text-xs text-muted-foreground">{app.document}</p>
              </div>
              {app.status === 'tasdiqlangan' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Tasdiqlangan
                </span>
              )}
              {app.status === 'rad' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                  <CircleX className="size-3.5" aria-hidden="true" />
                  Rad etilgan
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{app.auctionTitle}</p>
            <p className="text-xs">
              Garov depozit:{' '}
              <span
                className={
                  app.depositPaid
                    ? 'font-medium text-primary'
                    : 'font-medium text-destructive'
                }
              >
                {app.depositPaid ? "To'langan" : "To'lanmagan"}
              </span>
            </p>
            {app.status === 'kutilmoqda' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!app.depositPaid}
                  onClick={() => decide(app.id, 'tasdiqlangan')}
                >
                  <CircleCheck className="size-4" aria-hidden="true" />
                  Tasdiqlash
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => decide(app.id, 'rad')}
                >
                  <CircleX className="size-4" aria-hidden="true" />
                  Rad etish
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function WinnersTab() {
  const [winners, setWinners] = useState<Winner[]>(initialWinners)

  function approve(id: string) {
    setWinners((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'tasdiqlangan' } : w)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">
        G&apos;oliblarni tasdiqlash
      </h2>
      <div className="flex flex-col gap-4">
        {winners.map((w) => (
          <div
            key={w.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trophy className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-foreground">{w.auctionTitle}</p>
                <p className="text-sm text-muted-foreground">
                  G&apos;olib: {w.winnerName}
                </p>
                <p className="text-sm font-semibold text-primary">
                  Yakuniy taklif: {formatPrice(w.finalBid)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                <FileText className="size-3.5" aria-hidden="true" />
                {w.docsReady ? 'Hujjatlar tayyor' : 'Hujjatlar kutilmoqda'}
              </span>
              {w.status === 'tasdiq-kutmoqda' ? (
                <Button size="sm" onClick={() => approve(w.id)}>
                  <CircleCheck className="size-4" aria-hidden="true" />
                  G&apos;olibni tasdiqlash
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Tasdiqlangan
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const monthlyReport = [
  { month: 'Fevral', auctions: 2, revenue: '8.1 mlrd', participants: 34 },
  { month: 'Mart', auctions: 3, revenue: '11.6 mlrd', participants: 52 },
  { month: 'Aprel', auctions: 2, revenue: '7.4 mlrd', participants: 41 },
  { month: 'May', auctions: 3, revenue: '13.2 mlrd', participants: 61 },
  { month: 'Iyun', auctions: 2, revenue: '9.8 mlrd', participants: 47 },
  { month: 'Iyul', auctions: 2, revenue: '12.4 mlrd', participants: 51 },
]

function ReportTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Oylik hisobot</h2>
        <Button variant="outline" size="sm">
          <FileText className="size-4" aria-hidden="true" />
          PDF yuklab olish
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Oy (2026)</th>
              <th className="px-4 py-3 font-medium">Auktsionlar</th>
              <th className="px-4 py-3 font-medium">Tushum (so&apos;m)</th>
              <th className="px-4 py-3 font-medium">Ishtirokchilar</th>
            </tr>
          </thead>
          <tbody>
            {monthlyReport.map((r) => (
              <tr key={r.month} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{r.month}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.auctions} ta</td>
                <td className="px-4 py-3 font-medium text-foreground">{r.revenue}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.participants} ta</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        TZ 10-bo&apos;lim KPI: yiliga 24 ta e-auktsion (oyiga 2 ta) — joriy holat
        rejaga muvofiq.
      </p>
    </div>
  )
}
