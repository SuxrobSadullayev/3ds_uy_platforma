import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createSessionToken } from '@/lib/auth/session'

// Map public form role strings to DB user_role enum values
const ROLE_MAP: Record<string, 'buyer' | 'realtor' | 'company' | 'investor' | 'bank' | 'state_operator'> = {
  xaridor: 'buyer',
  buyer: 'buyer',
  rieltor: 'realtor',
  realtor: 'realtor',
  kompaniya: 'company',
  company: 'company',
  investor: 'investor',
  bank: 'bank',
  davlat: 'state_operator',
  state_operator: 'state_operator',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kiritilgan ma\'lumotlar noto\'g\'ri',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { fullName, email, phone, password, role } = validationResult.data
    const sanitizedEmail = email.trim().toLowerCase()

    // Sanitize role: public registration cannot create admins or super_admins
    const mappedRole = ROLE_MAP[role] || 'buyer'

    // Check existing user in DB
    const existing = await db.select().from(users).where(eq(users.email, sanitizedEmail))
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Ushbu email bilan foydalanuvchi allaqachon mavjud' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db
      .insert(users)
      .values({
        name: fullName,
        email: sanitizedEmail,
        phone,
        role: mappedRole,
        passwordHash: hashedPassword,
      })
      .returning()

    if (!newUser) {
      return NextResponse.json(
        { success: false, error: 'Foydalanuvchini saqlashda xatolik yuz berdi' },
        { status: 500 }
      )
    }

    const sessionToken = createSessionToken(newUser.id, newUser.role, newUser.email)
    const response = NextResponse.json(
      {
        success: true,
        message: 'Ro\'yxatdan muvaffaqiyatli o\'tildi',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    )

    // Set secure HTTP-only cookies
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err: any) {
    console.error('Register Error:', err)
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi. Qayta urinib ko\'ring.' },
      { status: 500 }
    )
  }
}
