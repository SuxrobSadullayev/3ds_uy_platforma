export type UserRole =
  | 'xaridor'
  | 'investor'
  | 'kompaniya'
  | 'rieltor'
  | 'bank'
  | 'davlat'
  | 'admin'

export type UserStatus = 'faol' | 'bloklangan' | 'kutmoqda'

export interface PlatformUser {
  id: string
  name: string
  role: UserRole
  status: UserStatus
  email: string
  phone: string
  joinedAt: string
  lastActive: string
  kycVerified: boolean
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  xaridor: 'Xaridor',
  investor: 'Investor',
  kompaniya: 'Qurilish kompaniya',
  rieltor: 'Rieltor',
  bank: 'Bank partnyor',
  davlat: 'Davlat operatori',
  admin: 'Super Admin',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  faol: 'Faol',
  bloklangan: 'Bloklangan',
  kutmoqda: 'Kutmoqda',
}

export const platformUsers: PlatformUser[] = [
  {
    id: 'u-001',
    name: 'Murad Buildings',
    role: 'kompaniya',
    status: 'faol',
    email: 'info@muradbuildings.uz',
    phone: '+998 71 200 10 10',
    joinedAt: '2026-01-12',
    lastActive: '2026-07-08',
    kycVerified: true,
  },
  {
    id: 'u-002',
    name: 'Golden House',
    role: 'kompaniya',
    status: 'faol',
    email: 'sales@goldenhouse.uz',
    phone: '+998 71 205 55 55',
    joinedAt: '2026-02-03',
    lastActive: '2026-07-09',
    kycVerified: true,
  },
  {
    id: 'u-003',
    name: 'Aziz Rahmonov',
    role: 'xaridor',
    status: 'faol',
    email: 'aziz.r@mail.uz',
    phone: '+998 90 123 45 67',
    joinedAt: '2026-03-18',
    lastActive: '2026-07-09',
    kycVerified: true,
  },
  {
    id: 'u-004',
    name: 'Dilnoza Yusupova',
    role: 'investor',
    status: 'faol',
    email: 'dilnoza.y@gmail.com',
    phone: '+998 93 555 12 34',
    joinedAt: '2026-02-27',
    lastActive: '2026-07-07',
    kycVerified: true,
  },
  {
    id: 'u-005',
    name: 'Alisher Karimov',
    role: 'rieltor',
    status: 'faol',
    email: 'alisher.k@realtor.uz',
    phone: '+998 97 700 20 30',
    joinedAt: '2026-01-30',
    lastActive: '2026-07-08',
    kycVerified: true,
  },
  {
    id: 'u-006',
    name: 'Ipoteka Bank',
    role: 'bank',
    status: 'faol',
    email: 'partner@ipotekabank.uz',
    phone: '+998 71 150 11 22',
    joinedAt: '2026-04-05',
    lastActive: '2026-07-06',
    kycVerified: true,
  },
  {
    id: 'u-007',
    name: 'Davlat aktivlari agentligi',
    role: 'davlat',
    status: 'faol',
    email: 'auction@davaktiv.uz',
    phone: '+998 71 233 44 55',
    joinedAt: '2026-01-08',
    lastActive: '2026-07-09',
    kycVerified: true,
  },
  {
    id: 'u-008',
    name: "O'ktam Rahimov",
    role: 'xaridor',
    status: 'kutmoqda',
    email: 'oktam.r@mail.uz',
    phone: '+998 94 321 65 87',
    joinedAt: '2026-07-05',
    lastActive: '2026-07-05',
    kycVerified: false,
  },
  {
    id: 'u-009',
    name: 'Fake Realty LLC',
    role: 'kompaniya',
    status: 'bloklangan',
    email: 'contact@fakerealty.io',
    phone: '+998 99 000 00 01',
    joinedAt: '2026-06-14',
    lastActive: '2026-06-20',
    kycVerified: false,
  },
  {
    id: 'u-010',
    name: 'Sardor Toshpulatov',
    role: 'investor',
    status: 'faol',
    email: 'sardor.t@invest.uz',
    phone: '+998 91 777 88 99',
    joinedAt: '2026-05-22',
    lastActive: '2026-07-09',
    kycVerified: true,
  },
]

export type ModerationStatus = 'kutmoqda' | 'tasdiqlangan' | 'rad-etilgan'

export interface ModerationItem {
  id: string
  propertyTitle: string
  company: string
  submittedAt: string
  type: string
  price: string
  status: ModerationStatus
  flags: string[]
}

export const moderationQueue: ModerationItem[] = [
  {
    id: 'm-001',
    propertyTitle: "4 xonali kvartira — Mirobod, yangi bino",
    company: 'Murad Buildings',
    submittedAt: '2026-07-09 09:12',
    type: 'Kvartira',
    price: "1.45 mlrd so'm",
    status: 'kutmoqda',
    flags: [],
  },
  {
    id: 'm-002',
    propertyTitle: "Do'kon binosi — Samarqand darvoza yaqinida",
    company: 'City Development Group',
    submittedAt: '2026-07-09 08:47',
    type: "Do'kon",
    price: "2.1 mlrd so'm",
    status: 'kutmoqda',
    flags: ['Hujjat tekshirilmagan'],
  },
  {
    id: 'm-003',
    propertyTitle: 'Penthouse — juda arzon narxda, shoshiling!!!',
    company: 'Fake Realty LLC',
    submittedAt: '2026-07-08 22:30',
    type: 'Kvartira',
    price: "150 mln so'm",
    status: 'kutmoqda',
    flags: ['Shubhali narx', 'Sotuvchi bloklangan'],
  },
  {
    id: 'm-004',
    propertyTitle: 'Ombor majmuasi — Sergeli logistika zonasi',
    company: 'Golden House',
    submittedAt: '2026-07-08 16:05',
    type: 'Ombor',
    price: "3.8 mlrd so'm",
    status: 'kutmoqda',
    flags: [],
  },
  {
    id: 'm-005',
    propertyTitle: '2 xonali kvartira — Yakkasaroy, metro yonida',
    company: 'NRG Uzbekistan',
    submittedAt: '2026-07-08 11:20',
    type: 'Kvartira',
    price: "980 mln so'm",
    status: 'kutmoqda',
    flags: ['3D model yuklanmagan'],
  },
]

export interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  role: UserRole
  action: string
  ip: string
  severity: 'info' | 'warning' | 'critical'
}

export const auditLog: AuditLogEntry[] = [
  {
    id: 'a-001',
    timestamp: '2026-07-09 10:42:18',
    user: 'Super Admin',
    role: 'admin',
    action: "Fake Realty LLC kabineti bloklandi (sabab: KYC firibgarlik)",
    ip: '185.74.5.12',
    severity: 'critical',
  },
  {
    id: 'a-002',
    timestamp: '2026-07-09 10:15:03',
    user: 'Murad Buildings',
    role: 'kompaniya',
    action: "Yangi mulk e'loni yuborildi: 4 xonali kvartira — Mirobod",
    ip: '84.54.71.201',
    severity: 'info',
  },
  {
    id: 'a-003',
    timestamp: '2026-07-09 09:58:44',
    user: 'Davlat aktivlari agentligi',
    role: 'davlat',
    action: 'Samarqand maktab binosi auktsioni tasdiqlandi',
    ip: '195.158.30.7',
    severity: 'info',
  },
  {
    id: 'a-004',
    timestamp: '2026-07-09 09:30:12',
    user: 'Sardor Toshpulatov',
    role: 'investor',
    action: "Escrow to'lov amalga oshirildi: 780 mln so'm (p-004)",
    ip: '213.230.99.45',
    severity: 'warning',
  },
  {
    id: 'a-005',
    timestamp: '2026-07-09 08:22:51',
    user: 'Aziz Rahmonov',
    role: 'xaridor',
    action: 'E-imzo bilan shartnoma imzolandi (SH-2026-0341)',
    ip: '94.158.52.118',
    severity: 'info',
  },
  {
    id: 'a-006',
    timestamp: '2026-07-08 23:59:59',
    user: 'Tizim',
    role: 'admin',
    action: 'Kunlik avtomatik backup muvaffaqiyatli yakunlandi',
    ip: 'localhost',
    severity: 'info',
  },
  {
    id: 'a-007',
    timestamp: '2026-07-08 21:14:33',
    user: 'Fake Realty LLC',
    role: 'kompaniya',
    action: "5 marta noto'g'ri parol kiritildi — hisob vaqtincha qulflandi",
    ip: '45.9.20.113',
    severity: 'critical',
  },
  {
    id: 'a-008',
    timestamp: '2026-07-08 18:40:07',
    user: 'Ipoteka Bank',
    role: 'bank',
    action: 'Kredit arizasi pre-approval berildi (AR-2026-1187)',
    ip: '195.69.189.22',
    severity: 'info',
  },
]

export interface RevenuePoint {
  month: string
  komissiya: number // mln so'm
  obuna: number
  auktsion: number
}

export const revenueData: RevenuePoint[] = [
  { month: 'Yan', komissiya: 320, obuna: 85, auktsion: 40 },
  { month: 'Fev', komissiya: 410, obuna: 92, auktsion: 55 },
  { month: 'Mar', komissiya: 380, obuna: 110, auktsion: 72 },
  { month: 'Apr', komissiya: 520, obuna: 118, auktsion: 60 },
  { month: 'May', komissiya: 610, obuna: 131, auktsion: 95 },
  { month: 'Iyn', komissiya: 690, obuna: 145, auktsion: 88 },
  { month: 'Iyl', komissiya: 740, obuna: 152, auktsion: 120 },
]

export const platformStats = {
  totalUsers: 48210,
  usersChange: '+2,140 / oy',
  monthlyRevenue: "1.01 mlrd so'm",
  revenueChange: '+11%',
  activeListings: 4870,
  listingsChange: '+312 / oy',
  completedDeals: 428,
  dealsChange: '+38 / oy',
}
