export type ApplicationStatus =
  | 'yangi'
  | 'korib-chiqilmoqda'
  | 'pre-approved'
  | 'tasdiqlandi'
  | 'rad-etildi'

export interface LoanApplication {
  id: string
  applicant: string
  phone: string
  property: string
  propertyPrice: number
  downPayment: number // boshlang'ich to'lov (so'm)
  requestedAmount: number
  termYears: number
  monthlyIncome: number
  status: ApplicationStatus
  submittedAt: string
  creditScore: number // 300–900
}

export interface LoanProduct {
  id: string
  name: string
  rate: number // yillik foiz
  maxTermYears: number
  minDownPaymentPercent: number
  maxAmount: number
  description: string
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  yangi: 'Yangi',
  'korib-chiqilmoqda': "Ko'rib chiqilmoqda",
  'pre-approved': 'Pre-approved',
  tasdiqlandi: 'Tasdiqlandi',
  'rad-etildi': 'Rad etildi',
}

export const loanProducts: LoanProduct[] = [
  {
    id: 'lp-001',
    name: 'Standart ipoteka',
    rate: 16.5,
    maxTermYears: 20,
    minDownPaymentPercent: 25,
    maxAmount: 2_000_000_000,
    description:
      "Tayyor uy-joy uchun klassik ipoteka. Boshlang'ich to'lov 25% dan, muddat 20 yilgacha.",
  },
  {
    id: 'lp-002',
    name: 'Yangi bino ipotekasi',
    rate: 14.0,
    maxTermYears: 25,
    minDownPaymentPercent: 20,
    maxAmount: 3_000_000_000,
    description:
      "Qurilayotgan va yangi topshirilgan binolar uchun imtiyozli stavka. Hamkor quruvchilar ro'yxati bilan.",
  },
  {
    id: 'lp-003',
    name: 'Yoshlar ipotekasi',
    rate: 12.0,
    maxTermYears: 25,
    minDownPaymentPercent: 15,
    maxAmount: 1_500_000_000,
    description:
      "30 yoshgacha bo'lgan fuqarolar uchun davlat subsidiyasi bilan imtiyozli ipoteka dasturi.",
  },
  {
    id: 'lp-004',
    name: 'Tijorat mulki krediti',
    rate: 19.0,
    maxTermYears: 10,
    minDownPaymentPercent: 30,
    maxAmount: 5_000_000_000,
    description:
      "Ofis, do'kon va boshqa tijorat obyektlari uchun biznes kredit liniyasi.",
  },
]

export const loanApplications: LoanApplication[] = [
  {
    id: 'app-001',
    applicant: 'Jasur Toshpulatov',
    phone: '+998 90 123 45 67',
    property: "Yangi 3 xonali kvartira — Mirzo Ulug'bek",
    propertyPrice: 1_150_000_000,
    downPayment: 345_000_000,
    requestedAmount: 805_000_000,
    termYears: 15,
    monthlyIncome: 18_000_000,
    status: 'korib-chiqilmoqda',
    submittedAt: '2026-07-07',
    creditScore: 720,
  },
  {
    id: 'app-002',
    applicant: 'Malika Ergasheva',
    phone: '+998 93 555 12 34',
    property: 'Zamonaviy 2 qavatli hovli uy — Qibray',
    propertyPrice: 2_800_000_000,
    downPayment: 840_000_000,
    requestedAmount: 1_960_000_000,
    termYears: 20,
    monthlyIncome: 32_000_000,
    status: 'pre-approved',
    submittedAt: '2026-07-05',
    creditScore: 810,
  },
  {
    id: 'app-003',
    applicant: 'Nilufar Sodiqova',
    phone: '+998 94 222 33 44',
    property: 'Yangi turar joy majmuasi — Sergeli',
    propertyPrice: 780_000_000,
    downPayment: 156_000_000,
    requestedAmount: 624_000_000,
    termYears: 25,
    monthlyIncome: 9_500_000,
    status: 'yangi',
    submittedAt: '2026-07-09',
    creditScore: 655,
  },
  {
    id: 'app-004',
    applicant: 'Otabek Yuldashev',
    phone: '+998 99 111 22 33',
    property: "Savdo do'koni — Chilonzor markazi",
    propertyPrice: 1_900_000_000,
    downPayment: 570_000_000,
    requestedAmount: 1_330_000_000,
    termYears: 10,
    monthlyIncome: 45_000_000,
    status: 'tasdiqlandi',
    submittedAt: '2026-06-28',
    creditScore: 780,
  },
  {
    id: 'app-005',
    applicant: 'Sherzod Alimov',
    phone: '+998 91 444 55 66',
    property: '1 xonali kvartira — Chorsu yaqinida',
    propertyPrice: 550_000_000,
    downPayment: 82_500_000,
    requestedAmount: 467_500_000,
    termYears: 20,
    monthlyIncome: 6_000_000,
    status: 'rad-etildi',
    submittedAt: '2026-06-25',
    creditScore: 480,
  },
  {
    id: 'app-006',
    applicant: 'Gulnora Karimova',
    phone: '+998 95 888 77 66',
    property: 'Premium penthaus — Yunusobod',
    propertyPrice: 4_500_000_000,
    downPayment: 1_800_000_000,
    requestedAmount: 2_700_000_000,
    termYears: 15,
    monthlyIncome: 85_000_000,
    status: 'korib-chiqilmoqda',
    submittedAt: '2026-07-08',
    creditScore: 845,
  },
]

// Annuitet oylik to'lov hisoblash
export function calcMonthlyPayment(
  amount: number,
  annualRate: number,
  years: number,
): number {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return amount / n
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}
