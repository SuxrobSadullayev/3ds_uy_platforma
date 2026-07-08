import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  description:
    "3D MULK platformasida hisob yarating: xaridor, investor, qurilish kompaniya yoki rieltor sifatida ro'yxatdan o'ting.",
}

export default function RoyxatdanOtishPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <AuthForm mode="royxat" />
      </main>
      <SiteFooter />
    </>
  )
}
