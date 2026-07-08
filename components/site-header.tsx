'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Building2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/mulklar', label: 'Mulklar' },
  { href: '/auktsion', label: 'E-Auktsion' },
  { href: '/rent-to-own', label: 'Rent-to-Own' },
  { href: '/investor', label: 'Investor' },
  { href: '/rieltor', label: 'Rieltor' },
  { href: '/dashboard', label: 'Kabinet' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            3D MULK
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Asosiy navigatsiya">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/kirish" />}>
            Kirish
          </Button>
          <Button size="sm" nativeButton={false} render={<Link href="/royxatdan-otish" />}>
            {"Ro'yxatdan o'tish"}
          </Button>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobil navigatsiya"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              nativeButton={false} render={<Link href="/kirish" />}
            >
              Kirish
            </Button>
            <Button size="sm" className="flex-1" nativeButton={false} render={<Link href="/royxatdan-otish" />}>
              {"Ro'yxatdan o'tish"}
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
