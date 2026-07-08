export type PropertyType =
  | 'kvartira'
  | 'uy'
  | 'ofis'
  | 'dokon'
  | 'ombor'
  | 'qurilish'
  | 'davlat'

export type PropertyStatus = 'sotuvda' | 'ijaraga' | 'auktsion' | 'sotilgan'

export interface Property {
  id: string
  title: string
  type: PropertyType
  status: PropertyStatus
  price: number // so'mda
  pricePerM2?: number
  region: string
  district: string
  address: string
  area: number // m²
  rooms: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  image: string
  images: string[]
  description: string
  has3D: boolean
  hasVirtualTour: boolean
  rentToOwn?: boolean
  featured?: boolean
  constructionProgress?: number // foizda, qurilayotgan binolar uchun
  seller: {
    name: string
    type: 'kompaniya' | 'rieltor' | 'davlat' | 'shaxsiy'
    verified: boolean
  }
  createdAt: string
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  kvartira: 'Kvartira',
  uy: 'Uy',
  ofis: 'Ofis',
  dokon: "Do'kon",
  ombor: 'Ombor',
  qurilish: 'Qurilayotgan bino',
  davlat: 'Davlat mulki',
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  sotuvda: 'Sotuvda',
  ijaraga: 'Ijaraga',
  auktsion: 'Auktsionda',
  sotilgan: 'Sotilgan',
}

export const REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand',
  'Buxoro',
  'Andijon',
  "Farg'ona",
  'Namangan',
  'Xorazm',
  'Navoiy',
  'Qashqadaryo',
  'Surxondaryo',
  'Jizzax',
  'Sirdaryo',
  "Qoraqalpog'iston",
] as const

export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} mlrd so'm`
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(0)} mln so'm`
  }
  return `${price.toLocaleString('uz-UZ')} so'm`
}

export const properties: Property[] = [
  {
    id: 'p-001',
    title: "Yangi 3 xonali kvartira — Mirzo Ulug'bek",
    type: 'kvartira',
    status: 'sotuvda',
    price: 1_150_000_000,
    pricePerM2: 13_100_000,
    region: 'Toshkent shahri',
    district: "Mirzo Ulug'bek tumani",
    address: "Buyuk Ipak Yo'li ko'chasi, 45",
    area: 88,
    rooms: 3,
    floor: 7,
    totalFloors: 16,
    yearBuilt: 2025,
    image: '/images/property-1.png',
    images: ['/images/property-1.png'],
    description:
      "Yangi qurilgan biznes-klass turar joy majmuasida zamonaviy ta'mirli 3 xonali kvartira. Panoramali derazalar, yopiq hovli, yer osti avtoturargohi. Metro bekati 5 daqiqa piyoda.",
    has3D: true,
    hasVirtualTour: true,
    featured: true,
    seller: { name: 'Murad Buildings', type: 'kompaniya', verified: true },
    createdAt: '2026-06-28',
  },
  {
    id: 'p-002',
    title: 'Zamonaviy 2 qavatli hovli uy — Qibray',
    type: 'uy',
    status: 'sotuvda',
    price: 2_800_000_000,
    pricePerM2: 11_200_000,
    region: 'Toshkent viloyati',
    district: 'Qibray tumani',
    address: "Do'stlik mahallasi, 12-uy",
    area: 250,
    rooms: 6,
    totalFloors: 2,
    yearBuilt: 2024,
    image: '/images/property-2.png',
    images: ['/images/property-2.png'],
    description:
      "6 sotix yer maydonida joylashgan zamonaviy 2 qavatli hovli uy. Yevro ta'mir, alohida garaj, bog', avtonom isitish tizimi. Shahar markazigacha 20 daqiqa.",
    has3D: true,
    hasVirtualTour: false,
    rentToOwn: true,
    featured: true,
    seller: { name: 'Alisher Karimov', type: 'rieltor', verified: true },
    createdAt: '2026-06-25',
  },
  {
    id: 'p-003',
    title: 'A-klass ofis — Tashkent City',
    type: 'ofis',
    status: 'ijaraga',
    price: 45_000_000,
    pricePerM2: 300_000,
    region: 'Toshkent shahri',
    district: 'Shayxontohur tumani',
    address: 'Tashkent City, Nest One binosi',
    area: 150,
    rooms: 4,
    floor: 12,
    totalFloors: 24,
    yearBuilt: 2023,
    image: '/images/property-3.png',
    images: ['/images/property-3.png'],
    description:
      "Tashkent City hududida A-klass biznes markazda ofis. To'liq jihozlangan, konferens zal, 24/7 xavfsizlik, tezyurar liftlar. Oylik ijara narxi.",
    has3D: true,
    hasVirtualTour: true,
    featured: true,
    seller: { name: 'City Development Group', type: 'kompaniya', verified: true },
    createdAt: '2026-07-01',
  },
  {
    id: 'p-004',
    title: 'Yangi turar joy majmuasi — Sergeli (qurilmoqda)',
    type: 'qurilish',
    status: 'sotuvda',
    price: 780_000_000,
    pricePerM2: 10_400_000,
    region: 'Toshkent shahri',
    district: 'Sergeli tumani',
    address: 'Yangi Sergeli, 4-mavze',
    area: 75,
    rooms: 2,
    floor: 5,
    totalFloors: 12,
    yearBuilt: 2027,
    image: '/images/property-4.png',
    images: ['/images/property-4.png'],
    description:
      "Qurilayotgan zamonaviy turar joy majmuasida 2 xonali kvartira. Boshlang'ich to'lov 30%, qolgani 24 oyga bo'lib to'lash. Topshirish muddati: 2027-yil 2-chorak.",
    has3D: true,
    hasVirtualTour: false,
    constructionProgress: 45,
    featured: true,
    seller: { name: 'Golden House', type: 'kompaniya', verified: true },
    createdAt: '2026-06-20',
  },
  {
    id: 'p-005',
    title: "Savdo do'koni — Chilonzor markazi",
    type: 'dokon',
    status: 'sotuvda',
    price: 1_900_000_000,
    pricePerM2: 19_000_000,
    region: 'Toshkent shahri',
    district: 'Chilonzor tumani',
    address: "Bunyodkor shoh ko'chasi, 8",
    area: 100,
    rooms: 2,
    floor: 1,
    totalFloors: 9,
    yearBuilt: 2020,
    image: '/images/property-5.png',
    images: ['/images/property-5.png'],
    description:
      "Chilonzor tumanining eng gavjum ko'chasida joylashgan savdo do'koni. Katta vitrina oynalar, alohida kirish, yuqori odam oqimi. Tayyor biznes uchun ideal.",
    has3D: false,
    hasVirtualTour: true,
    seller: { name: "O'ktam Rahimov", type: 'shaxsiy', verified: false },
    createdAt: '2026-06-15',
  },
  {
    id: 'p-006',
    title: 'Premium penthaus — Yunusobod',
    type: 'kvartira',
    status: 'sotuvda',
    price: 4_500_000_000,
    pricePerM2: 22_500_000,
    region: 'Toshkent shahri',
    district: 'Yunusobod tumani',
    address: "Amir Temur shoh ko'chasi, 107",
    area: 200,
    rooms: 5,
    floor: 20,
    totalFloors: 20,
    yearBuilt: 2024,
    image: '/images/property-6.png',
    images: ['/images/property-6.png'],
    description:
      "Shahar panoramasi ochiladigan hashamatli penthaus. 2 darajali, terrasa, panoramali oynalar, aqlli uy tizimi, premium ta'mir. Yer osti avtoturargohida 2 ta joy.",
    has3D: true,
    hasVirtualTour: true,
    featured: true,
    seller: { name: 'NRG Uzbekistan', type: 'kompaniya', verified: true },
    createdAt: '2026-07-03',
  },
  {
    id: 'p-007',
    title: 'Davlat mulki: sobiq maktab binosi — Samarqand',
    type: 'davlat',
    status: 'auktsion',
    price: 3_200_000_000,
    region: 'Samarqand',
    district: 'Samarqand shahri',
    address: "Registon ko'chasi, 22",
    area: 850,
    rooms: 18,
    totalFloors: 2,
    yearBuilt: 1978,
    image: '/images/property-3.png',
    images: ['/images/property-3.png'],
    description:
      "E-auktsion orqali sotilayotgan davlat mulki. Sobiq maktab binosi, katta yer maydoni bilan. Turizm yoki ta'lim maqsadlarida foydalanish mumkin. Boshlang'ich narx ko'rsatilgan.",
    has3D: false,
    hasVirtualTour: false,
    seller: { name: 'Davlat aktivlari agentligi', type: 'davlat', verified: true },
    createdAt: '2026-06-30',
  },
  {
    id: 'p-008',
    title: '1 xonali kvartira — Chorsu yaqinida',
    type: 'kvartira',
    status: 'ijaraga',
    price: 5_500_000,
    region: 'Toshkent shahri',
    district: 'Olmazor tumani',
    address: "Qorasaroy ko'chasi, 33",
    area: 42,
    rooms: 1,
    floor: 3,
    totalFloors: 5,
    yearBuilt: 2015,
    image: '/images/property-1.png',
    images: ['/images/property-1.png'],
    description:
      "Chorsu bozori yaqinida ixcham 1 xonali kvartira ijaraga beriladi. Barcha kommunal qulayliklar, mebel va texnika bilan. Oylik ijara narxi ko'rsatilgan.",
    has3D: false,
    hasVirtualTour: false,
    rentToOwn: true,
    seller: { name: 'Dilnoza Yusupova', type: 'shaxsiy', verified: true },
    createdAt: '2026-07-05',
  },
]

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured)
}
