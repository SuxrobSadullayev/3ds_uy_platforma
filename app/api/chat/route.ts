import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { properties, formatPrice, PROPERTY_TYPE_LABELS } from '@/lib/data/properties'

export const maxDuration = 30

const propertyCatalog = properties
  .map(
    (p) =>
      `- [${p.id}] ${p.title} | Turi: ${PROPERTY_TYPE_LABELS[p.type]} | Narxi: ${formatPrice(p.price)} | ${p.region}, ${p.district} | ${p.area} m², ${p.rooms} xona${p.floor ? `, ${p.floor}-qavat` : ''} | Holati: ${p.status}${p.has3D ? ' | 3D model bor' : ''}${p.rentToOwn ? ' | Rent-to-Own mavjud' : ''}`,
  )
  .join('\n')

const systemPrompt = `Sen "3D MULK" — O'zbekiston 3D ko'chmas mulk platformasining AI yordamchisisan.

QOIDALAR:
- Faqat o'zbek tilida javob ber (foydalanuvchi kirill alifbosida yozsa, kirillda javob ber; lotin alifbosida yozsa, lotinda javob ber).
- Qisqa, aniq va foydali javoblar ber. Ortiqcha gap yozma.
- Mulk, ipoteka, ijara, e-auktsion, Rent-to-Own, investitsiya mavzularida yordam ber.
- Murakkab huquqiy yoki shaxsiy moliyaviy masalalarda foydalanuvchini platformadagi rieltor mutaxassislarga yo'naltir.
- Platformadagi mavjud mulklar haqida so'ralsa, quyidagi katalogdan foydalangan holda javob ber va mulk sahifasiga havola ber: /mulklar/[id] ko'rinishida.
- Narxlar so'mda ko'rsatilgan.

PLATFORMA IMKONIYATLARI:
- 3D ko'rish: mulklarni brauzerda 3D formatda aylantirib ko'rish
- E-Auktsion: davlat mulklari uchun onlayn kim oshdi savdosi (/auktsion)
- Rent-to-Own: ijaraga olib keyin sotib olish dasturi (/rent-to-own)
- AI Narx Baholash: mulk qiymatini avtomatik baholash (/narx-baholash)
- Ipoteka: bank partnyorlar orqali kredit olish (/bank)
- Kabinetlar: xaridor (/xaridor), investor (/investor), rieltor (/rieltor), kompaniya (/kompaniya)

MULKLAR KATALOGI:
${propertyCatalog}`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'google/gemini-3-flash',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
