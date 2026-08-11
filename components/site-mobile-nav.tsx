'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Gavel, Home, Sparkles, User } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Bosh sahifa', icon: Home },
  { href: '/mulklar', label: 'Katalog', icon: Building2 },
  { href: '/auktsion', label: 'Auktsion', icon: Gavel },
  { href: '/narx-baholash', label: 'AI Baholash', icon: Sparkles },
  { href: '/profil', label: 'Kabinet', icon: User },
]

export function SiteMobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 px-2 py-1.5 shadow-2xl backdrop-blur-md md:hidden"
      aria-label="Mobil navigatsiya"
    >
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
            >
              <Icon className={`size-5 transition-transform ${isActive ? 'scale-110' : ''}`} aria-hidden="true" />
              <span className="text-[10px] leading-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 size-1 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
