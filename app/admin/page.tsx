import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AdminClient } from '@/components/admin/admin-client'

export const metadata: Metadata = {
  title: 'Super Admin kabineti',
  description:
    'Super Admin boshqaruv paneli: foydalanuvchilar, kontent moderatsiya, daromad tahlili va audit log.',
}

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Super Admin kabineti
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platforma boshqaruvi: foydalanuvchilar, moderatsiya, daromad va xavfsizlik
          </p>
        </div>
        <AdminClient />
      </main>
      <SiteFooter />
    </>
  )
}
