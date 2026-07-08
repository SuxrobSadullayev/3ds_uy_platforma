import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const metadata: Metadata = {
  title: 'Kabinet',
  description:
    "Shaxsiy kabinet: statistika, bozor tahlili, bildirishnomalar va mulklar boshqaruvi. Xaridor, investor, kompaniya va admin rollari.",
}

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Kabinet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rolingizni tanlang va shaxsiy statistikangizni kuzating
          </p>
        </div>
        <DashboardClient />
      </main>
      <SiteFooter />
    </>
  )
}
