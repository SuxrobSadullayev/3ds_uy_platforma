import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="bg-primary">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center md:px-6 md:py-20">
        <h2 className="max-w-2xl text-2xl font-bold text-primary-foreground md:text-3xl text-balance">
          {"Mulkingizni platformada joylashtiring yoki orzuingizdagi uyni toping"}
        </h2>
        <p className="max-w-xl leading-relaxed text-primary-foreground/80 text-pretty">
          {"Qurilish kompaniyalari, rieltorlar, investorlar va xaridorlar uchun yagona ekotizim. Bepul ro'yxatdan o'ting."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            nativeButton={false} render={<Link href="/royxatdan-otish" />}
          >
            {"Ro'yxatdan o'tish"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            nativeButton={false} render={<Link href="/mulklar" />}
          >
            {"Mulklarni ko'rish"}
          </Button>
        </div>
      </div>
    </section>
  )
}
