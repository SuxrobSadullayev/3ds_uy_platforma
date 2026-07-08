import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AvmClient } from '@/components/avm/avm-client'

export const metadata: Metadata = {
  title: 'AI Narx Baholash',
  description:
    "AI asosidagi avtomatik baholash modeli (AVM): mulkingiz bozor qiymatini joylashuv, maydon, qavat va boshqa omillar asosida bir zumda aniqlang.",
}

export default function NarxBaholashPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            AI Narx Baholash (AVM)
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Mulk parametrlarini kiriting — avtomatik baholash modeli bozor
            ma&apos;lumotlari asosida taxminiy qiymatni ±10% aniqlikda hisoblab beradi.
          </p>
        </div>
        <AvmClient />
      </main>
      <SiteFooter />
    </>
  )
}
