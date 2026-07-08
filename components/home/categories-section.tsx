import Link from 'next/link'
import {
  Building,
  Home,
  Briefcase,
  Store,
  Warehouse,
  HardHat,
  Landmark,
} from 'lucide-react'

const categories = [
  { type: 'kvartira', label: 'Kvartiralar', icon: Building },
  { type: 'uy', label: 'Uylar', icon: Home },
  { type: 'ofis', label: 'Ofislar', icon: Briefcase },
  { type: 'dokon', label: "Do'konlar", icon: Store },
  { type: 'ombor', label: 'Omborlar', icon: Warehouse },
  { type: 'qurilish', label: 'Yangi qurilishlar', icon: HardHat },
  { type: 'davlat', label: 'Davlat mulklari', icon: Landmark },
]

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Kategoriyalar
        </h2>
        <p className="text-muted-foreground">
          {"O'zingizga kerakli mulk turini tanlang"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={`/mulklar?tur=${cat.type}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary hover:bg-secondary"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <cat.icon className="size-6" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-card-foreground">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
