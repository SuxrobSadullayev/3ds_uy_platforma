import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { OperatorClient } from '@/components/davlat-operator/operator-client'

export const metadata: Metadata = {
  title: 'Davlat Operatori kabineti',
  description:
    "Davlat operatori kabineti: e-auktsion e'lon qilish, ishtirokchilar KYC tasdiqlash, g'olibni tasdiqlash va hisobotlar.",
}

export default function DavlatOperatorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Davlat Operatori kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            E-auktsion boshqaruvi: e&apos;lon, KYC tasdiqlash, g&apos;olib va hisobotlar
          </p>
        </div>
        <OperatorClient />
      </main>
      <SiteFooter />
    </>
  )
}
