'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ROLES = [
  { value: 'xaridor', label: 'Xaridor' },
  { value: 'investor', label: 'Investor' },
  { value: 'kompaniya', label: 'Qurilish kompaniya' },
  { value: 'rieltor', label: 'Rieltor / Agent' },
] as const

export function AuthForm({ mode }: { mode: 'kirish' | 'royxat' }) {
  const isRegister = mode === 'royxat'
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRegister
            ? "3D MULK platformasida hisob yarating"
            : 'Hisobingizga kiring va kabinetdan foydalaning'}
        </p>
      </div>

      <form
        className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        {isRegister && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Ism va familiya
              </span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Alisher Karimov"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Rol</span>
              <select
                name="role"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="siz@misol.uz"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Parol</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder="Kamida 8 ta belgi"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </label>

        <Button type="submit" className="mt-2 w-full">
          {isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
        </Button>

        {submitted && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-xs leading-relaxed text-primary"
          >
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Demo rejim: haqiqiy autentifikatsiya keyingi bosqichda ma&apos;lumotlar bazasi
            ulanganidan so&apos;ng ishga tushadi.
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {isRegister ? 'Hisobingiz bormi?' : "Hisobingiz yo'qmi?"}{' '}
          <Link
            href={isRegister ? '/kirish' : '/royxatdan-otish'}
            className="font-medium text-primary hover:underline"
          >
            {isRegister ? 'Kirish' : "Ro'yxatdan o'tish"}
          </Link>
        </p>
      </form>
    </div>
  )
}
