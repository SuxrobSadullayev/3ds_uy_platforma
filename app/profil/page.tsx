import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProfilClient } from '@/components/profil/profil-client'

export const metadata: Metadata = {
  title: 'Profil sozlamalari',
  description:
    "Profil sozlamalari: shaxsiy ma'lumotlar, hujjatlar (KYC), to'lov usullari, bildirishnoma va xavfsizlik sozlamalari.",
}

export default function ProfilPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Profil sozlamalari
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shaxsiy ma&apos;lumotlar, hujjatlar, to&apos;lov usullari va xavfsizlik
          </p>
        </div>
        <ProfilClient />
      </main>
      <SiteFooter />
    </>
  )
}
