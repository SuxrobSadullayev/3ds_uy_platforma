export type AuctionType = 'ochiq' | 'maxfiy' | 'vaqt-chekli'
export type AuctionStatus = 'jonli' | 'kutilmoqda' | 'yakunlangan'

export interface Auction {
  id: string
  propertyId?: string
  title: string
  type: AuctionType
  status: AuctionStatus
  startPrice: number
  currentBid: number
  bidIncrement: number
  bidders: number
  deposit: number
  region: string
  area: number
  image: string
  endsAt: string // ISO
  organizer: string
}

export const AUCTION_TYPE_LABELS: Record<AuctionType, string> = {
  ochiq: 'Ochiq kim oshdi',
  maxfiy: 'Maxfiy taklif',
  'vaqt-chekli': 'Vaqt chekli',
}

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  jonli: 'Jonli',
  kutilmoqda: 'Kutilmoqda',
  yakunlangan: 'Yakunlangan',
}

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString()
}

export const auctions: Auction[] = [
  {
    id: 'a-001',
    propertyId: 'p-007',
    title: 'Davlat mulki: sobiq maktab binosi — Samarqand',
    type: 'ochiq',
    status: 'jonli',
    startPrice: 3_200_000_000,
    currentBid: 3_650_000_000,
    bidIncrement: 50_000_000,
    bidders: 14,
    deposit: 160_000_000,
    region: 'Samarqand',
    area: 850,
    image: '/images/property-3.png',
    endsAt: hoursFromNow(2.4),
    organizer: 'Davlat aktivlari agentligi',
  },
  {
    id: 'a-002',
    title: "Ma'muriy bino — Buxoro markazi",
    type: 'ochiq',
    status: 'jonli',
    startPrice: 5_800_000_000,
    currentBid: 6_100_000_000,
    bidIncrement: 100_000_000,
    bidders: 9,
    deposit: 290_000_000,
    region: 'Buxoro',
    area: 1200,
    image: '/images/property-5.png',
    endsAt: hoursFromNow(5.7),
    organizer: 'Davlat aktivlari agentligi',
  },
  {
    id: 'a-003',
    title: 'Yer maydoni (0.8 ga) — Toshkent viloyati',
    type: 'vaqt-chekli',
    status: 'kutilmoqda',
    startPrice: 2_400_000_000,
    currentBid: 2_400_000_000,
    bidIncrement: 40_000_000,
    bidders: 22,
    deposit: 120_000_000,
    region: 'Toshkent viloyati',
    area: 8000,
    image: '/images/property-2.png',
    endsAt: hoursFromNow(26),
    organizer: 'Yer resurslari agentligi',
  },
  {
    id: 'a-004',
    title: 'Sobiq zavod ombori — Andijon',
    type: 'maxfiy',
    status: 'kutilmoqda',
    startPrice: 1_750_000_000,
    currentBid: 1_750_000_000,
    bidIncrement: 25_000_000,
    bidders: 6,
    deposit: 87_500_000,
    region: 'Andijon',
    area: 2400,
    image: '/images/property-4.png',
    endsAt: hoursFromNow(49),
    organizer: 'Davlat aktivlari agentligi',
  },
  {
    id: 'a-005',
    title: "Tijorat binosi — Farg'ona shahri",
    type: 'ochiq',
    status: 'yakunlangan',
    startPrice: 3_900_000_000,
    currentBid: 4_750_000_000,
    bidIncrement: 50_000_000,
    bidders: 18,
    deposit: 195_000_000,
    region: "Farg'ona",
    area: 640,
    image: '/images/property-6.png',
    endsAt: hoursFromNow(-20),
    organizer: 'Davlat aktivlari agentligi',
  },
]

export function getLiveAuction(): Auction {
  return auctions.find((a) => a.status === 'jonli') ?? auctions[0]
}
