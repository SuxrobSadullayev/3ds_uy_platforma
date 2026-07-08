import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { R2oClient } from '@/components/rent-to-own/r2o-client'

export const metadata: Metadata = {
  title: 'Rent-to-Own',
  description:
    "Rent-to-Own: ijara to'lovlari orqali uy egasiga aylaning. Narx qulflash, to'lov jadvali va qayta sotib olish huquqi bilan.",
}

export default function RentToOwnPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Rent-to-Own — ijaradan mulkka
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Oylik ijara to&apos;lovlaringiz uy narxidan ayirilib boradi. Boshlang&apos;ich
            kelishilgan narx muddat oxirigacha o&apos;zgarmaydi.
          </p>
        </div>
        <R2oClient />
      </main>
      <SiteFooter />
    </>
  )
}
