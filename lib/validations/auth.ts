import { z } from 'zod'

export const userRoleSchema = z.enum([
  'xaridor',
  'rieltor',
  'kompaniya',
  'investor',
  'bank',
  'davlat',
  'admin',
])

export const loginSchema = z.object({
  email: z.string().min(3, "Email yoki telefon kiritilishi majburiy"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
})

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Ism va familiya kamida 3 ta belgi bo'lishi kerak"),
    email: z.string().email("Yaroqli email manzilini kiriting"),
    phone: z
      .string()
      .regex(/^\+998\d{9}$/, "Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak"),
    password: z.string().min(8, "Parol kamida 8 ta belgi bo'lishi kerak"),
    confirmPassword: z.string(),
    role: userRoleSchema.default('xaridor'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Foydalanish shartlariga rozilik bildirishingiz kerak" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar bir-biriga mos kelmadi",
    path: ['confirmPassword'],
  })

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "SMS kod 6 xonali raqam bo'lishi kerak")
    .regex(/^\d{6}$/, "Faqat raqam kiritilishi kerak"),
})

export const passwordResetSchema = z.object({
  email: z.string().email("Yaroqli email manzilini kiriting"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type OtpFormValues = z.infer<typeof otpSchema>
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>
