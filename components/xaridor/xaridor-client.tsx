'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatPrice,
  properties,
  PROPERTY_TYPE_LABELS,
  type Property,
} from '@/lib/data/properties'

type Tab = 'sevimlilar' | 'solishtirish' | 'chat' | 'uchrashuvlar'

const TABS: { id: Tab; label: string }[] = [
  { id: 'sevimlilar', label: 'Sevimlilar' },
  { id: 'solishtirish', label: 'Solishtirish' },
  { id: 'chat', label: 'Chat' },
  { id: 'uchrashuvlar', label: 'Uchrashuvlar' },
]

export function XaridorClient() {
  const [tab, setTab] = useState<Tab>('sevimlilar')
  const [favorites, setFavorites] = useState<string[]>(['p-001', 'p-002', 'p-004', 'p-006'])
  const [compareIds, setCompareIds] = useState<string[]>(['p-001', 'p-004'])

  function removeFavorite(id: string) {
    setFavorites((prev) => prev.filter((f) => f !== id))
    setCompareIds((prev) => prev.filter((c) => c !== id))
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Xaridor bo'limlari">
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

      {tab === 'sevimlilar' && (
        <FavoritesTab
          favorites={favorites}
          compareIds={compareIds}
          onRemove={removeFavorite}
          onToggleCompare={toggleCompare}
          onCompare={() => setTab('solishtirish')}
        />
      )}
      {tab === 'solishtirish' && (
        <CompareTab compareIds={compareIds} onRemove={toggleCompare} />
      )}
      {tab === 'chat' && <ChatTab />}
      {tab === 'uchrashuvlar' && <AppointmentsTab />}
    </div>
  )
}

function FavoritesTab({
  favorites,
  compareIds,
  onRemove,
  onToggleCompare,
  onCompare,
}: {
  favorites: string[]
  compareIds: string[]
  onRemove: (id: string) => void
  onToggleCompare: (id: string) => void
  onCompare: () => void
}) {
  const favProperties = favorites
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p))

  if (favProperties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <Heart className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Sevimlilar ro&apos;yxati bo&apos;sh.{' '}
          <Link href="/mulklar" className="font-semibold text-primary hover:underline">
            Mulklarni ko&apos;rish
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {favProperties.length} ta sevimli mulk · Solishtirish uchun max 3 ta tanlang
        </p>
        {compareIds.length >= 2 && (
          <Button size="sm" onClick={onCompare}>
            Solishtirish ({compareIds.length})
          </Button>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favProperties.map((p) => {
          const inCompare = compareIds.includes(p.id)
          return (
            <li
              key={p.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.image || '/placeholder.svg'}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label="Sevimlilardan olib tashlash"
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-card/90 text-destructive transition-colors hover:bg-card"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <Link
                  href={`/mulklar/${p.id}`}
                  className="line-clamp-1 text-sm font-semibold text-card-foreground hover:text-primary"
                >
                  {p.title}
                </Link>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  {p.district} · {p.area} m² · {p.rooms} xona
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="text-sm font-bold text-primary">{formatPrice(p.price)}</span>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(p.id)}
                    disabled={!inCompare && compareIds.length >= 3}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      inCompare
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    {inCompare ? (
                      <>
                        <Check className="size-3.5" aria-hidden="true" /> Tanlandi
                      </>
                    ) : (
                      'Solishtirish'
                    )}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const COMPARE_ROWS: { label: string; render: (p: Property) => string }[] = [
  { label: 'Turi', render: (p) => PROPERTY_TYPE_LABELS[p.type] },
  { label: 'Narx', render: (p) => formatPrice(p.price) },
  {
    label: 'm² narxi',
    render: (p) => (p.pricePerM2 ? formatPrice(p.pricePerM2) : '—'),
  },
  { label: 'Maydon', render: (p) => `${p.area} m²` },
  { label: 'Xonalar', render: (p) => `${p.rooms} xona` },
  {
    label: 'Qavat',
    render: (p) => (p.floor ? `${p.floor}/${p.totalFloors ?? '—'}` : '—'),
  },
  { label: 'Qurilgan yili', render: (p) => (p.yearBuilt ? String(p.yearBuilt) : '—') },
  { label: 'Hudud', render: (p) => p.district },
  { label: '3D model', render: (p) => (p.has3D ? 'Mavjud' : "Yo'q") },
  { label: '360° tour', render: (p) => (p.hasVirtualTour ? 'Mavjud' : "Yo'q") },
  { label: 'Rent-to-Own', render: (p) => (p.rentToOwn ? 'Ha' : "Yo'q") },
  { label: 'Sotuvchi', render: (p) => p.seller.name },
]

function CompareTab({
  compareIds,
  onRemove,
}: {
  compareIds: string[]
  onRemove: (id: string) => void
}) {
  const compared = compareIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p))

  if (compared.length < 2) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        Solishtirish uchun Sevimlilar bo&apos;limidan kamida 2 ta mulk tanlang (max 3 ta).
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Tanlangan mulklarni solishtirish jadvali</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-4 py-3 text-xs font-medium text-muted-foreground">
              Xususiyat
            </th>
            {compared.map((p) => (
              <th scope="col" key={p.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/mulklar/${p.id}`}
                    className="line-clamp-2 text-sm font-semibold text-card-foreground hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`${p.title} ni solishtirishdan olib tashlash`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {COMPARE_ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="px-4 py-3 text-xs font-medium text-muted-foreground">
                {row.label}
              </th>
              {compared.map((p) => (
                <td key={p.id} className="px-4 py-3 text-card-foreground">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ChatMessage {
  id: number
  from: 'men' | 'sotuvchi'
  text: string
  time: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: 'men',
    text: "Assalomu alaykum! Mirzo Ulug'bekdagi 3 xonali kvartira hali sotuvdami?",
    time: '10:02',
  },
  {
    id: 2,
    from: 'sotuvchi',
    text: 'Vaalaykum assalom! Ha, sotuvda. 3D modelini platformada ko\u2018rishingiz mumkin.',
    time: '10:05',
  },
  {
    id: 3,
    from: 'men',
    text: "Ipoteka bilan olsam, boshlang'ich to'lov qancha bo'ladi?",
    time: '10:07',
  },
  {
    id: 4,
    from: 'sotuvchi',
    text: "Boshlang'ich to'lov 25% — taxminan 287 mln so'm. Ipoteka Bank bilan pre-approval ham platformada mavjud.",
    time: '10:11',
  },
]

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [text, setText] = useState('')

  function send() {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: 'men',
        text: trimmed,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setText('')
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-xl border border-border bg-card p-3">
        <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground">Suhbatlar</h2>
        <ul className="mt-1 flex flex-col gap-1">
          <li className="rounded-lg bg-primary/10 p-3">
            <p className="text-sm font-semibold text-card-foreground">Murad Buildings</p>
            <p className="truncate text-xs text-muted-foreground">
              Boshlang&apos;ich to&apos;lov 25% — taxminan...
            </p>
          </li>
          <li className="rounded-lg p-3 transition-colors hover:bg-muted">
            <p className="text-sm font-medium text-card-foreground">Golden House</p>
            <p className="truncate text-xs text-muted-foreground">
              Sergeli majmuasi 2027 2-chorakda topshiriladi
            </p>
          </li>
          <li className="rounded-lg p-3 transition-colors hover:bg-muted">
            <p className="text-sm font-medium text-card-foreground">Alisher Karimov (rieltor)</p>
            <p className="truncate text-xs text-muted-foreground">Qibray uyi hujjatlari tayyor</p>
          </li>
        </ul>
      </aside>

      <section
        aria-label="Murad Buildings bilan suhbat"
        className="flex h-[480px] flex-col rounded-xl border border-border bg-card"
      >
        <header className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-card-foreground">Murad Buildings</p>
          <p className="text-xs text-accent">Onlayn · odatda 10 daqiqada javob beradi</p>
        </header>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex max-w-[80%] flex-col gap-0.5 ${
                m.from === 'men' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <p
                className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.from === 'men'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-secondary text-secondary-foreground'
                }`}
              >
                {m.text}
              </p>
              <span className="px-1 text-[10px] text-muted-foreground">{m.time}</span>
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Xabar yozing..."
            aria-label="Xabar matni"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" size="icon" aria-label="Xabar yuborish">
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </section>
    </div>
  )
}

interface Appointment {
  id: string
  property: string
  seller: string
  date: string
  time: string
  status: 'tasdiqlangan' | 'kutmoqda' | 'yakunlangan'
}

const APPOINTMENTS: Appointment[] = [
  {
    id: 'ap-1',
    property: 'Premium penthaus — Yunusobod',
    seller: 'NRG Uzbekistan',
    date: '2026-07-10',
    time: '15:00',
    status: 'tasdiqlangan',
  },
  {
    id: 'ap-2',
    property: 'Yangi turar joy majmuasi — Sergeli',
    seller: 'Golden House',
    date: '2026-07-12',
    time: '11:30',
    status: 'kutmoqda',
  },
  {
    id: 'ap-3',
    property: "Yangi 3 xonali kvartira — Mirzo Ulug'bek",
    seller: 'Murad Buildings',
    date: '2026-07-04',
    time: '16:00',
    status: 'yakunlangan',
  },
]

const APPOINTMENT_BADGE: Record<Appointment['status'], string> = {
  tasdiqlangan: 'bg-accent/10 text-accent',
  kutmoqda: 'bg-primary/10 text-primary',
  yakunlangan: 'bg-muted text-muted-foreground',
}

const APPOINTMENT_LABEL: Record<Appointment['status'], string> = {
  tasdiqlangan: 'Tasdiqlangan',
  kutmoqda: 'Kutmoqda',
  yakunlangan: 'Yakunlangan',
}

function AppointmentsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Uchrashuv tasdiqlanganda SMS va email orqali eslatma yuboriladi. Uchrashuvni bekor
          qilish uchun kamida 3 soat oldin xabar bering.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {APPOINTMENTS.map((ap) => (
          <li
            key={ap.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{ap.property}</p>
                <p className="text-xs text-muted-foreground">
                  {ap.seller} · {ap.date}, soat {ap.time}
                </p>
              </div>
            </div>
            <span
              className={`inline-block w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${APPOINTMENT_BADGE[ap.status]}`}
            >
              {APPOINTMENT_LABEL[ap.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
