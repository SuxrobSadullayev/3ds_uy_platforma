import type { PropertyType } from '@/lib/data/properties'

/**
 * AVM — Algoritmik va Statistik Ko'chmas Mulk Baholash Modeli (Hedonic Valuation Engine)
 * Bozor statistikasi, hududiy koeffitsientlar va xususiyatlar asosida narx baholaydi.
 */

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
  confidenceScore: number // Percentage 0-100%
  factors: { label: string; impact: number }[]
}

export function estimatePrice(input: AvmInput): AvmResult {
  const base = REGION_BASE_PRICE[input.region] ?? 6_000_000
  const factors: { label: string; impact: number }[] = []

  let pricePerM2 = base * (TYPE_MULTIPLIER[input.type] || 1.0)
  factors.push({
    label: 'Mulk turi koeffitsienti',
    impact: Math.round(((TYPE_MULTIPLIER[input.type] || 1.0) - 1) * 100),
  })

  // Bino yoshi va amortizatsiyasi
  const age = Math.max(0, new Date().getFullYear() - input.yearBuilt)
  let ageAdj = 0
  if (age <= 3) {
    ageAdj = 0.08 // Yangi bino premium
  } else {
    ageAdj = -Math.min(0.3, age * 0.007) // Yillik amortizatsiya
  }
  pricePerM2 *= 1 + ageAdj
  factors.push({ label: 'Bino yoshi va statusi', impact: Math.round(ageAdj * 100) })

  // Qavat joylashuvi bo'yicha baholash
  if (input.floor && input.totalFloors && input.totalFloors > 1) {
    let floorAdj = 0.02
    if (input.floor === 1) floorAdj = -0.05 // Birinchi qavat
    else if (input.floor === input.totalFloors) floorAdj = -0.04 // Oxirgi qavat
    pricePerM2 *= 1 + floorAdj
    factors.push({ label: 'Qavat qulayligi', impact: Math.round(floorAdj * 100) })
  }

  // Maydon zichligi elastikligi
  if (input.area > 0 && input.area < 45) {
    pricePerM2 *= 1.07
    factors.push({ label: 'Kichik maydon (yuqori talab)', impact: 7 })
  } else if (input.area > 150) {
    pricePerM2 *= 0.94
    factors.push({ label: 'Katta maydon chegirmasi', impact: -6 })
  }

  // Ta'mir holati
  if (input.hasRenovation) {
    pricePerM2 *= 1.12
    factors.push({ label: "Yevro ta'mir", impact: 12 })
  } else {
    pricePerM2 *= 0.92
    factors.push({ label: "Ta'mirtalab holat", impact: -8 })
  }

  // Transport va metro infratuzilmasi
  if (input.nearMetro) {
    pricePerM2 *= 1.09
    factors.push({ label: 'Metro yaqinligi', impact: 9 })
  }

  const estimatedPrice = Math.round(pricePerM2 * input.area)

  // Baholashning ishonchlilik darajasi (Confidence Score)
  const confidenceScore = input.region === 'Toshkent shahri' ? 94 : 88

  return {
    estimatedPrice,
    lowPrice: Math.round(estimatedPrice * 0.95), // 5% interval
    highPrice: Math.round(estimatedPrice * 1.05),
    pricePerM2: Math.round(pricePerM2),
    confidenceScore,
    factors,
  }
}
