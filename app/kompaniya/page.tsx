import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { KompaniyaClient } from '@/components/kompaniya/kompaniya-client'

export const metadata: Metadata = {
  title: 'Qurilish kompaniya kabineti',
  description:
    "Qurilish kompaniya kabineti: mulk e'lonlarini boshqarish, yangi e'lon qo'shish, media yuklash va sotish statistikasi.",
}

export default function KompaniyaPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Qurilish kompaniya kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            E&apos;lonlar boshqaruvi, media yuklash va sotish ko&apos;rsatkichlari
          </p>
        </div>
        <KompaniyaClient />
      </main>
      <SiteFooter />
    </>
  )
}
