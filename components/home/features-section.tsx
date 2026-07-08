import { Box, ShieldCheck, Gavel, Bot, FileSignature, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Box,
    title: "3D va 360° ko'rish",
    description:
      "Mulkni jismoniy bormasdan brauzerda 3D model va virtual tur orqali to'liq o'rganing.",
  },
  {
    icon: ShieldCheck,
    title: 'Xavfsiz bitimlar',
    description:
      "Escrow to'lov tizimi, KYC tasdiqlash va kadastr integratsiyasi orqali firibgarlikdan himoya.",
  },
  {
    icon: Gavel,
    title: 'E-Auktsion',
    description:
      'Davlat mulklarini shaffof onlayn auktsionlarda real vaqtda takliflar berish orqali sotib oling.',
  },
  {
    icon: Bot,
    title: 'AI yordamchi',
    description:
      "O'zbek tilida 24/7 ishlaydigan AI assistent — narx baholash, mos mulk tanlash va yo'riqnoma.",
  },
  {
    icon: FileSignature,
    title: 'E-imzo shartnomalar',
    description:
      "Shartnomalarni platformada elektron imzolang — O'zbekiston qonunchiligiga to'liq muvofiq.",
  },
  {
    icon: TrendingUp,
    title: 'Investor tahlillari',
    description:
      'ROI kalkulyator, narx monitoringi va bozor dinamikasi — investitsiya qarorlari uchun.',
  },
]

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
          Nima uchun 3D MULK?
        </h2>
        <p className="max-w-2xl text-muted-foreground text-pretty">
          {"Ko'chmas mulk bozorini to'liq raqamlashtiruvchi zamonaviy texnologiyalar"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
              <feature.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold text-card-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
