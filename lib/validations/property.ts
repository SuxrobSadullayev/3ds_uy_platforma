import { z } from 'zod'

export const propertyTypeSchema = z.enum([
  'kvartira',
  'uy',
  'ofis',
  'dokon',
  'ombor',
  'qurilish',
  'davlat',
])

export const propertySchema = z.object({
  title: z
    .string()
    .min(5, "Mulk sarlavhasi kamida 5 ta belgi bo'lishi kerak")
    .max(120, "Sarlavha 120 ta belgidan oshmasligi kerak"),
  type: propertyTypeSchema,
  area: z.number().gt(0, "Maydon 0 dan katta bo'lishi kerak"),
  price: z.number().min(1_000_000, "Narx kamida 1,000,000 so'm bo'lishi kerak"),
  rooms: z.number().int().min(1, "Xonalar soni kamida 1 ta bo'lishi kerak"),
  floor: z.number().int().min(1).optional(),
  totalFloors: z.number().int().min(1).optional(),
  region: z.string().min(2, "Viloyat/Shahar tanlanishi lozim"),
  district: z.string().min(2, "Tuman kiritilishi lozim"),
  address: z.string().min(3, "Aniq manzil kiritilishi lozim"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak"),
  description: z.string().min(10, "Tavsif kamida 10 ta belgi bo'lishi kerak"),
  has3D: z.boolean().default(false),
  hasVirtualTour: z.boolean().default(false),
  rentToOwn: z.boolean().default(false),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
