import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CatalogClient } from '@/components/catalog/catalog-client'

export const metadata: Metadata = {
  title: 'Mulk katalogi',
  description:
    "O'zbekiston bo'ylab kvartira, uy, ofis va boshqa ko'chmas mulklarni filtrlab qidiring. 3D ko'rish va 360° virtual turlar bilan.",
}

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Mulk katalogi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Barcha mulk turlarini filtrlab toping — 3D va 360° ko&apos;rish bilan
          </p>
        </div>
        <CatalogClient />
      </main>
      <SiteFooter />
    </>
  )
}
