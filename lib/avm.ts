import type { PropertyType } from '@/lib/data/properties'

// AVM — Avtomatik baholash modeli (regression-uslubidagi koeffitsientlar)
// Bozor ma'lumotlari asosida m² uchun bazaviy narxlar (so'mda)

export const REGION_BASE_PRICE: Record<string, number> = {
  'Toshkent shahri': 13_500_000,
  'Toshkent viloyati': 8_500_000,
  Samarqand: 7_800_000,
  Buxoro: 7_200_000,
  Andijon: 6_500_000,
  "Farg'ona": 6_300_000,
  Namangan: 6_200_000,
  Xorazm: 5_800_000,
  Navoiy: 6_800_000,
  Qashqadaryo: 5_600_000,
  Surxondaryo: 5_400_000,
  Jizzax: 5_500_000,
  Sirdaryo: 5_300_000,
  "Qoraqalpog'iston": 5_000_000,
}

export const TYPE_MULTIPLIER: Record<PropertyType, number> = {
  kvartira: 1.0,
  uy: 0.88,
  ofis: 1.35,
  dokon: 1.5,
  ombor: 0.55,
  qurilish: 0.8,
  davlat: 0.7,
}

export interface AvmInput {
  region: string
  type: PropertyType
  area: number
  rooms: number
  floor?: number
  totalFloors?: number
  yearBuilt: number
  hasRenovation: boolean
  nearMetro: boolean
}

export interface AvmResult {
  estimatedPrice: number
  lowPrice: number
  highPrice: number
  pricePerM2: number
  factors: { label: string; impact: number }[]
}

export function estimatePrice(input: AvmInput): AvmResult {
  const base = REGION_BASE_PRICE[input.region] ?? 6_000_000
  const factors: { label: string; impact: number }[] = []

  let pricePerM2 = base * TYPE_MULTIPLIER[input.type]
  factors.push({
    label: 'Mulk turi koeffitsienti',
    impact: (TYPE_MULTIPLIER[input.type] - 1) * 100,
  })

  // Bino yoshi: har yil uchun -0.6%, maksimal -30%; yangi bino (<=3 yosh) +5%
  const age = Math.max(0, new Date().getFullYear() - input.yearBuilt)
  let ageAdj = 0
  if (age <= 3) {
    ageAdj = 0.05
  } else {
    ageAdj = -Math.min(0.3, age * 0.006)
  }
  pricePerM2 *= 1 + ageAdj
  factors.push({ label: 'Bino yoshi', impact: ageAdj * 100 })

  // Qavat: birinchi qavat -5%, oxirgi qavat -3%, o'rta qavatlar +2%
  if (input.floor && input.totalFloors && input.totalFloors > 1) {
    let floorAdj = 0.02
    if (input.floor === 1) floorAdj = -0.05
    else if (input.floor === input.totalFloors) floorAdj = -0.03
    pricePerM2 *= 1 + floorAdj
    factors.push({ label: 'Qavat joylashuvi', impact: floorAdj * 100 })
  }

  // Kichik kvartiralar m² boshiga qimmatroq
  if (input.area > 0 && input.area < 50) {
    pricePerM2 *= 1.06
    factors.push({ label: 'Ixcham maydon', impact: 6 })
  } else if (input.area > 150) {
    pricePerM2 *= 0.95
    factors.push({ label: 'Katta maydon', impact: -5 })
  }

  if (input.hasRenovation) {
    pricePerM2 *= 1.12
    factors.push({ label: "Yevro ta'mir", impact: 12 })
  }

  if (input.nearMetro) {
    pricePerM2 *= 1.08
    factors.push({ label: 'Metro yaqinligi', impact: 8 })
  }

  const estimatedPrice = Math.round(pricePerM2 * input.area)

  return {
    estimatedPrice,
    lowPrice: Math.round(estimatedPrice * 0.9),
    highPrice: Math.round(estimatedPrice * 1.1),
    pricePerM2: Math.round(pricePerM2),
    factors,
  }
}
