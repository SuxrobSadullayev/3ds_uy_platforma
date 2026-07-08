'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { REGIONS } from '@/lib/data/properties'

const dealTypes = [
  { value: 'sotuvda', label: 'Sotib olish' },
  { value: 'ijaraga', label: 'Ijaraga olish' },
  { value: 'auktsion', label: 'Auktsion' },
]

export function HeroSection() {
  const router = useRouter()
  const [dealType, setDealType] = useState('sotuvda')
  const [region, setRegion] = useState('')
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (dealType) params.set('holat', dealType)
    if (region) params.set('hudud', region)
    if (query) params.set('q', query)
    router.push(`/mulklar?${params.toString()}`)
  }

  return (
    <section className="relative">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-city.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center md:px-6 md:py-32">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {"O'zbekiston bo'ylab"}
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white text-balance md:text-5xl">
            {"Ko'chmas mulkni 3D formatda ko'ring va xavfsiz sotib oling"}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {"Kvartira, uy, ofis va davlat mulklari — barchasini bir platformada. Virtual tur, e-auktsion va shaffof bitimlar."}
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl rounded-xl bg-card p-3 shadow-xl"
        >
          <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1">
            {dealTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setDealType(t.value)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  dealType === t.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={dealType === t.value}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <label className="sr-only" htmlFor="hero-region">
              Hudud
            </label>
            <select
              id="hero-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm text-foreground md:w-48"
            >
              <option value="">Barcha hududlar</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-query">
              Qidiruv
            </label>
            <input
              id="hero-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tuman, majmua yoki kalit so'z..."
              className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" size="lg" className="h-11 gap-2">
              <Search className="size-4" aria-hidden="true" />
              Qidirish
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-8 text-white">
          {[
            { value: '5,000+', label: 'Faol e\u2019lonlar' },
            { value: '50,000+', label: 'Foydalanuvchilar' },
            { value: '500+', label: 'Yakunlangan bitimlar' },
            { value: '24/7', label: 'AI yordamchi' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold md:text-3xl">{stat.value}</span>
              <span className="text-xs text-white/70 md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
