export interface PortfolioItem {
  id: string
  propertyId: string
  title: string
  district: string
  buyPrice: number // sotib olingan narx, so'm
  currentPrice: number // joriy bozor narxi, so'm
  buyDate: string
  monthlyIncome?: number // ijara daromadi, so'm/oy
}

export interface WatchedProperty {
  id: string
  title: string
  district: string
  price: number
  change30d: number // foizda
  alert: 'sotish' | 'kuzatish' | 'sotib-olish'
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'pf-001',
    propertyId: 'p-001',
    title: "3 xonali kvartira — Mirzo Ulug'bek",
    district: "Mirzo Ulug'bek tumani",
    buyPrice: 980_000_000,
    currentPrice: 1_150_000_000,
    buyDate: '2025-03-14',
    monthlyIncome: 9_500_000,
  },
  {
    id: 'pf-002',
    propertyId: 'p-005',
    title: "Savdo do'koni — Chilonzor markazi",
    district: 'Chilonzor tumani',
    buyPrice: 1_650_000_000,
    currentPrice: 1_900_000_000,
    buyDate: '2024-11-02',
    monthlyIncome: 22_000_000,
  },
  {
    id: 'pf-003',
    propertyId: 'p-004',
    title: '2 xonali kvartira — Sergeli (qurilmoqda)',
    district: 'Sergeli tumani',
    buyPrice: 690_000_000,
    currentPrice: 780_000_000,
    buyDate: '2026-01-20',
  },
  {
    id: 'pf-004',
    propertyId: 'p-008',
    title: '1 xonali kvartira — Olmazor',
    district: 'Olmazor tumani',
    buyPrice: 520_000_000,
    currentPrice: 560_000_000,
    buyDate: '2025-08-09',
    monthlyIncome: 5_500_000,
  },
]

export const watchedProperties: WatchedProperty[] = [
  {
    id: 'w-001',
    title: 'Premium penthaus — Yunusobod',
    district: 'Yunusobod tumani',
    price: 4_500_000_000,
    change30d: 2.4,
    alert: 'kuzatish',
  },
  {
    id: 'w-002',
    title: "Savdo do'koni — Chilonzor",
    district: 'Chilonzor tumani',
    price: 1_900_000_000,
    change30d: 5.2,
    alert: 'sotish',
  },
  {
    id: 'w-003',
    title: 'Yangi majmua — Sergeli 4-mavze',
    district: 'Sergeli tumani',
    price: 780_000_000,
    change30d: -1.1,
    alert: 'sotib-olish',
  },
  {
    id: 'w-004',
    title: 'A-klass ofis — Tashkent City',
    district: 'Shayxontohur tumani',
    price: 6_800_000_000,
    change30d: 3.8,
    alert: 'kuzatish',
  },
]

export const WATCH_ALERT_LABELS: Record<WatchedProperty['alert'], string> = {
  sotish: 'Sotish tavsiya',
  kuzatish: 'Kuzatuvda',
  'sotib-olish': 'Sotib olish imkoni',
}
