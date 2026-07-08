'use client'

import { useState } from 'react'
import {
  Bell,
  CreditCard,
  FileText,
  Globe,
  ShieldCheck,
  Upload,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Section = 'shaxsiy' | 'hujjatlar' | 'tolov' | 'bildirishnoma' | 'xavfsizlik'

const SECTIONS: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'shaxsiy', label: "Shaxsiy ma'lumotlar", icon: User },
  { id: 'hujjatlar', label: 'Hujjatlar (KYC)', icon: FileText },
  { id: 'tolov', label: "To'lov usullari", icon: CreditCard },
  { id: 'bildirishnoma', label: 'Bildirishnomalar', icon: Bell },
  { id: 'xavfsizlik', label: 'Xavfsizlik', icon: ShieldCheck },
]

export function ProfilClient() {
  const [section, setSection] = useState<Section>('shaxsiy')

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <nav
        className="flex shrink-0 gap-1 overflow-x-auto md:w-56 md:flex-col"
        aria-label="Profil bo'limlari"
      >
        {SECTIONS.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                section === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              aria-current={section === s.id ? 'page' : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {s.label}
            </button>
          )
        })}
      </nav>

      <div className="min-w-0 flex-1 rounded-xl border border-border bg-card p-5 md:p-6">
        {section === 'shaxsiy' && <PersonalSection />}
        {section === 'hujjatlar' && <DocumentsSection />}
        {section === 'tolov' && <PaymentSection />}
        {section === 'bildirishnoma' && <NotificationSection />}
        {section === 'xavfsizlik' && <SecuritySection />}
      </div>
    </div>
  )
}

function Field({
  label,
  id,
  type = 'text',
  defaultValue,
}: {
  label: string
  id: string
  type?: string
  defaultValue?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}

function PersonalSection() {
  const [lang, setLang] = useState<'uz' | 'ru' | 'en'>('uz')

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Shaxsiy ma'lumotlar"
    >
      <h2 className="text-lg font-semibold text-foreground">Shaxsiy ma&apos;lumotlar</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ism" id="first-name" defaultValue="Suxrob" />
        <Field label="Familiya" id="last-name" defaultValue="Sadullayev" />
        <Field label="Telefon" id="phone" type="tel" defaultValue="+998 90 123 45 67" />
        <Field label="Email" id="email" type="email" defaultValue="suxrob@example.uz" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Globe className="size-4" aria-hidden="true" />
          Platforma tili
        </span>
        <div className="flex gap-2" role="radiogroup" aria-label="Platforma tili">
          {(
            [
              { id: 'uz', label: "O'zbek" },
              { id: 'ru', label: 'Русский' },
              { id: 'en', label: 'English' },
            ] as const
          ).map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                lang === l.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Button type="submit">Saqlash</Button>
      </div>
    </form>
  )
}

const documents = [
  { name: 'Passport (AB 1234567)', status: 'Tasdiqlangan', ok: true },
  { name: "Mulk guvohnomasi — Mirzo Ulug'bek kvartira", status: 'Tasdiqlangan', ok: true },
  { name: 'Soliq raqami (STIR)', status: "Ko'rib chiqilmoqda", ok: false },
]

function DocumentsSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">Hujjatlar (KYC)</h2>
        <Button variant="outline" size="sm">
          <Upload className="size-4" aria-hidden="true" />
          Hujjat yuklash
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        KYC tasdiqlash auktsionda qatnashish va bitim imzolash uchun majburiy
        (TZ 6.2-bo&apos;lim).
      </p>
      <ul className="flex flex-col gap-2">
        {documents.map((d) => (
          <li
            key={d.name}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
              <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{d.name}</span>
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                d.ok
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent/10 text-accent-foreground'
              }`}
            >
              {d.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const paymentMethods = [
  { name: 'Payme', detail: '**** 8912', primary: true },
  { name: 'Click', detail: '+998 90 *** ** 67', primary: false },
  { name: 'Uzum Pay', detail: '**** 3345', primary: false },
]

function PaymentSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">To&apos;lov usullari</h2>
        <Button variant="outline" size="sm">
          <CreditCard className="size-4" aria-hidden="true" />
          Karta qo&apos;shish
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {paymentMethods.map((p) => (
          <li
            key={p.name}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.detail}</p>
              </div>
            </div>
            {p.primary && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Asosiy
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Barcha to&apos;lovlar platformaning xavfsiz escrow hisobi orqali amalga
        oshiriladi.
      </p>
    </div>
  )
}

function Toggle({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [on, setOn] = useState(defaultChecked ?? false)
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          on ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-transform ${
            on ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function NotificationSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Bildirishnoma sozlamalari</h2>
      <div className="flex flex-col gap-2">
        <Toggle
          label="Narx o'zgarishi"
          description="Kuzatuvdagi mulk narxi ±5% o'zgarganda SMS + push"
          defaultChecked
        />
        <Toggle
          label="AI Match takliflar"
          description="Har kuni sizga mos yangi mulklar haqida push"
          defaultChecked
        />
        <Toggle
          label="Auktsion ogohlantirishlari"
          description="Auktsion boshlanishi va yakuni haqida SMS + email"
          defaultChecked
        />
        <Toggle
          label="Chat xabarlari"
          description="Sotuvchi yoki rieltordan yangi xabar kelganda"
          defaultChecked
        />
        <Toggle
          label="Haftalik bozor xulosasi"
          description="Bozor dinamikasi va eng faol hududlar bo'yicha email"
        />
      </div>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Xavfsizlik</h2>
      <div className="flex flex-col gap-2">
        <Toggle
          label="2FA — ikki bosqichli himoya"
          description="SMS OTP yoki Google Authenticator orqali kirish tasdiqlash"
          defaultChecked
        />
        <Toggle
          label="Biometrik kirish (mobil)"
          description="Face ID / Touch ID orqali tezkor kirish"
          defaultChecked
        />
        <Toggle
          label="Yangi qurilmadan kirish haqida xabar"
          description="Hisobingizga yangi qurilmadan kirilganda email yuboriladi"
          defaultChecked
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground">Parolni o&apos;zgartirish</h3>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="Joriy parol" id="current-password" type="password" />
          <Field label="Yangi parol" id="new-password" type="password" />
          <div>
            <Button type="submit" size="sm">
              Parolni yangilash
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        Oxirgi kirish: 2026-07-09, 09:41 — Toshkent (Chrome, Windows). Barcha
        amallar audit logda saqlanadi (TZ 6.2).
      </div>
    </div>
  )
}
