import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { InvestorClient } from '@/components/investor/investor-client'

export const metadata: Metadata = {
  title: 'Investor kabineti',
  description:
    "Investor kabineti: portfolio boshqaruv, ROI kalkulyator, AI kuzatuvchi va bozor tahlili. Ko'chmas mulk investitsiyalaringizni bir joyda kuzating.",
}

export default function InvestorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Investor kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Portfolio, ROI hisob-kitobi va AI narx monitoringi
          </p>
        </div>
        <InvestorClient />
      </main>
      <SiteFooter />
    </>
  )
}
