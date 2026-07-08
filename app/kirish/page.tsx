import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = {
  title: 'Kirish',
  description: "3D MULK platformasiga kirish: hisobingizga kiring va kabinetdan foydalaning.",
}

export default function KirishPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <AuthForm mode="kirish" />
      </main>
      <SiteFooter />
    </>
  )
}
