import Link from 'next/link'
import { Building2, Clock, Mail, Phone, Send } from 'lucide-react'

const footerSections = [
  {
    title: 'Platforma',
    links: [
      { href: '/mulklar', label: 'Mulklar katalogi' },
      { href: '/auktsion', label: 'E-Auktsion' },
      { href: '/rent-to-own', label: 'Rent-to-Own' },
      { href: '/narx-baholash', label: 'AI Baholash' },
      { href: '/dashboard', label: 'Kabinet' },
    ],
  },
  {
    title: 'Foydalanuvchilar',
    links: [
      { href: '/royxatdan-otish?role=xaridor', label: 'Xaridorlar uchun' },
      { href: '/royxatdan-otish?role=kompaniya', label: 'Kompaniyalar uchun' },
      { href: '/royxatdan-otish?role=investor', label: 'Investorlar uchun' },
      { href: '/royxatdan-otish?role=rieltor', label: 'Rieltorlar uchun' },
    ],
  },
  {
    title: "Ma'lumot",
    links: [
      { href: '/haqimizda', label: 'Biz haqimizda' },
      { href: '/maxfiylik', label: 'Maxfiylik siyosati' },
      { href: '/shartlar', label: 'Foydalanish shartlari' },
      { href: '/boglanish', label: "Bog'lanish" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Platform Info & Contacts */}
          <div className="flex flex-col gap-4">
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

            <div className="flex flex-col gap-2 pt-1 text-xs text-muted-foreground">
              <a
                href="tel:+998712000000"
                className="flex items-center gap-2 font-medium text-foreground hover:text-primary transition-colors"
              >
                <Phone className="size-3.5 text-primary" aria-hidden="true" />
                <span>+998 (71) 200-00-00</span>
              </a>
              <a
                href="mailto:info@3dmulk.uz"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="size-3.5 text-primary" aria-hidden="true" />
                <span>info@3dmulk.uz</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Du - Sha: 09:00 - 18:00</span>
              </div>
            </div>
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

        {/* Social Links & Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {'© 2026 3D MULK. Barcha huquqlar himoyalangan.'}
          </p>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://t.me/3dmulk_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Send className="size-3.5" aria-hidden="true" />
              <span>Telegram Kanal</span>
            </a>
            <a
              href="https://t.me/3dmulk_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Send className="size-3.5" aria-hidden="true" />
              <span>Support Bot</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
