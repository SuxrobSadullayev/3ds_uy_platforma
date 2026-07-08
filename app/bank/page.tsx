import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BankClient } from '@/components/bank/bank-client'

export const metadata: Metadata = {
  title: 'Bank/Ipoteka Partnyor kabineti',
  description:
    "Bank partnyorlar uchun kredit arizalari boshqaruvi: pre-approval, kredit reyting tahlili va ipoteka mahsulotlari.",
}

export default function BankPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Bank/Ipoteka Partnyor kabineti
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Platformadan kelgan kredit arizalarini qabul qiling, pre-approval
            bering va ipoteka mahsulotlaringizni boshqaring.
          </p>
        </div>
        <BankClient />
      </main>
      <SiteFooter />
    </>
  )
}
