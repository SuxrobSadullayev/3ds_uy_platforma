'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertOctagon, Home, RefreshCw, ShieldAlert } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log exception silently to console/Sentry
    console.error('Unhandled App Runtime Error:', error)
  }, [error])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 md:px-6 text-center">
        <div className="flex flex-col items-center justify-center gap-6 max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 shadow-xl">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertOctagon className="size-8" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tizim Xatoligi Yuz Berdi
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Kutilmagan texnik nosozlik sababli sahifani yuklab bo&apos;lmadi. Qayta urinib ko&apos;ring yoki bosh sahifaga o&apos;ting.
            </p>
          </div>

          {error.digest && (
            <div className="w-full rounded-xl border border-border bg-card p-3 font-mono text-[11px] text-muted-foreground truncate">
              Error Digest: {error.digest}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span>Qayta Yuklash (Reset)</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
            >
              <Home className="size-4" aria-hidden="true" />
              <span>Bosh sahifa</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
