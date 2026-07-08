import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { XaridorClient } from '@/components/xaridor/xaridor-client'

export const metadata: Metadata = {
  title: 'Xaridor kabineti',
  description:
    'Xaridor kabineti: sevimli mulklar, solishtirish, sotuvchi bilan chat va uchrashuvlar boshqaruvi.',
}

export default function XaridorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Xaridor kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sevimlilar, mulk solishtirish, chat va uchrashuvlar
          </p>
        </div>
        <XaridorClient />
      </main>
      <SiteFooter />
    </>
  )
}
