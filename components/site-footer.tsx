import Link from 'next/link'
import { Building2 } from 'lucide-react'

const footerSections = [
  {
    title: 'Platforma',
    links: [
      { href: '/mulklar', label: 'Mulklar katalogi' },
      { href: '/auktsion', label: 'E-Auktsion' },
      { href: '/dashboard', label: 'Kabinet' },
    ],
  },
  {
    title: 'Foydalanuvchilar',
    links: [
      { href: '/royxatdan-otish', label: 'Xaridorlar uchun' },
      { href: '/royxatdan-otish', label: 'Kompaniyalar uchun' },
      { href: '/royxatdan-otish', label: 'Investorlar uchun' },
      { href: '/royxatdan-otish', label: 'Rieltorlar uchun' },
    ],
  },
  {
    title: "Ma'lumot",
    links: [
      { href: '#', label: 'Biz haqimizda' },
      { href: '#', label: 'Maxfiylik siyosati' },
      { href: '#', label: 'Foydalanish shartlari' },
      { href: '#', label: "Bog'lanish" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                3D MULK
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {"O'zbekiston ko'chmas mulk bozorini raqamlashtiruvchi yagona ishonchli 3D platforma."}
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {'© 2026 3D MULK. Barcha huquqlar himoyalangan.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
