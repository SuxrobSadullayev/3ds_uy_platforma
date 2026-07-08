export type LeadStage = 'yangi' | 'aloqada' | 'korish' | 'muzokara' | 'yopildi'

export interface Lead {
  id: string
  name: string
  phone: string
  interest: string
  budget: number
  stage: LeadStage
  lastContact: string
}

export interface Meeting {
  id: string
  time: string
  date: string
  client: string
  property: string
  type: 'korish' | 'qongiroq' | 'imzolash'
}

export interface Deal {
  id: string
  property: string
  client: string
  amount: number
  commissionRate: number // foizda
  closedAt: string
}

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  yangi: 'Yangi',
  aloqada: 'Aloqada',
  korish: "Ko'rish belgilandi",
  muzokara: 'Muzokara',
  yopildi: 'Yopildi',
}

export const leads: Lead[] = [
  {
    id: 'l-001',
    name: 'Jasur Toshpulatov',
    phone: '+998 90 123 45 67',
    interest: "3 xonali kvartira, Mirzo Ulug'bek",
    budget: 1_200_000_000,
    stage: 'muzokara',
    lastContact: '2026-07-08',
  },
  {
    id: 'l-002',
    name: 'Malika Ergasheva',
    phone: '+998 93 555 12 34',
    interest: 'Hovli uy, Qibray yoki Zangiota',
    budget: 3_000_000_000,
    stage: 'korish',
    lastContact: '2026-07-07',
  },
  {
    id: 'l-003',
    name: 'Bekzod Nazarov',
    phone: '+998 97 777 88 99',
    interest: "Ofis ijarasi, Tashkent City",
    budget: 50_000_000,
    stage: 'aloqada',
    lastContact: '2026-07-06',
  },
  {
    id: 'l-004',
    name: 'Nilufar Sodiqova',
    phone: '+998 94 222 33 44',
    interest: '2 xonali kvartira, Sergeli (yangi bino)',
    budget: 800_000_000,
    stage: 'yangi',
    lastContact: '2026-07-09',
  },
  {
    id: 'l-005',
    name: 'Otabek Yuldashev',
    phone: '+998 99 111 22 33',
    interest: "Savdo do'koni, Chilonzor",
    budget: 2_000_000_000,
    stage: 'yopildi',
    lastContact: '2026-07-01',
  },
]

export const meetings: Meeting[] = [
  {
    id: 'm-001',
    time: '10:00',
    date: '2026-07-10',
    client: 'Malika Ergasheva',
    property: 'Hovli uy — Qibray',
    type: 'korish',
  },
  {
    id: 'm-002',
    time: '14:30',
    date: '2026-07-10',
    client: 'Jasur Toshpulatov',
    property: "Kvartira — Mirzo Ulug'bek",
    type: 'imzolash',
  },
  {
    id: 'm-003',
    time: '16:00',
    date: '2026-07-11',
    client: 'Bekzod Nazarov',
    property: 'Ofis — Tashkent City',
    type: 'qongiroq',
  },
]

export const MEETING_TYPE_LABELS: Record<Meeting['type'], string> = {
  korish: "Ko'rsatuv",
  qongiroq: "Qo'ng'iroq",
  imzolash: 'Shartnoma imzolash',
}

export const deals: Deal[] = [
  {
    id: 'd-001',
    property: "Savdo do'koni — Chilonzor",
    client: 'Otabek Yuldashev',
    amount: 1_900_000_000,
    commissionRate: 2,
    closedAt: '2026-07-01',
  },
  {
    id: 'd-002',
    property: '1 xonali kvartira — Olmazor',
    client: 'Sardor Alimov',
    amount: 560_000_000,
    commissionRate: 2.5,
    closedAt: '2026-06-18',
  },
  {
    id: 'd-003',
    property: 'Hovli uy — Zangiota',
    client: 'Gulnora Karimova',
    amount: 2_400_000_000,
    commissionRate: 1.8,
    closedAt: '2026-06-05',
  },
]
