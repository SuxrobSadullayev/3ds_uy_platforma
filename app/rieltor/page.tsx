import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { RieltorClient } from '@/components/rieltor/rieltor-client'

export const metadata: Metadata = {
  title: 'Rieltor kabineti',
  description:
    'Rieltor/Agent kabineti: mijozlar CRM, uchrashuvlar taqvimi, komission hisob va konversiya hisobotlari.',
}

export default function RieltorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Rieltor kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mijozlar CRM, taqvim va komission hisob-kitobi
          </p>
        </div>
        <RieltorClient />
      </main>
      <SiteFooter />
    </>
  )
}
