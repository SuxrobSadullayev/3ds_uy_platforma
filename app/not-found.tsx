'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Compass, Home, Search } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/mulklar?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 md:px-6 text-center">
        <div className="relative flex flex-col items-center justify-center gap-6 max-w-lg">
          {/* Animated 404 3D Compass Badge */}
          <div className="relative flex size-28 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-xl backdrop-blur-md">
            <Compass className="size-14 text-primary animate-spin-slow" aria-hidden="true" />
            <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
              404
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Sahifa Topilmadi
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Siz qidirayotgan sahifa o&apos;chirilgan, nomi o&apos;zgartirilgan yoki vaqtincha mavjud emas bo&apos;lishi mumkin.
            </p>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="w-full relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mulk, hudud yoki manzilni qidiring..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              <Home className="size-4" aria-hidden="true" />
              <span>Bosh sahifaga qaytish</span>
            </Link>
            <Link
              href="/mulklar"
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-xs font-bold text-secondary-foreground hover:bg-muted transition-colors"
            >
              <Building2 className="size-4" aria-hidden="true" />
              <span>Mulk katalogi</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
