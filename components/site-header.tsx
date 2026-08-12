'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Building2, Menu, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '/mulklar', label: 'Mulklar' },
  { href: '/auktsion', label: 'E-Auktsion' },
  { href: '/rent-to-own', label: 'Rent-to-Own' },
  { href: '/narx-baholash', label: 'AI Baholash' },
  { href: '/investor', label: 'Investor' },
  { href: '/bank', label: 'Bank' },
  { href: '/dashboard', label: 'Kabinet' },
]

const mobileOnlyLinks = [
  { href: '/rieltor', label: 'Rieltor CRM' },
  { href: '/xaridor', label: 'Xaridor' },
  { href: '/kompaniya', label: 'Kompaniya' },
  { href: '/davlat-operator', label: 'Davlat operatori' },
  { href: '/profil', label: 'Profil sozlamalari' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

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
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm font-medium transition-colors hover:text-foreground relative py-1 ${
                  isActive
                    ? 'text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Profil sozlamalari"
              asChild
            >
              <Link href="/profil">
                <UserRound className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/kirish">Kirish</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/royxatdan-otish">{"Ro'yxatdan o'tish"}</Link>
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
      </div>

      {open && (
        <nav
          className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobil navigatsiya"
        >
          {[...navLinks, ...mobileOnlyLinks].map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link href="/kirish">Kirish</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/royxatdan-otish">{"Ro'yxatdan o'tish"}</Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
