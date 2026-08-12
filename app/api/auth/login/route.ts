import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/lib/validations/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createSessionToken } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

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

    const { email, password } = validationResult.data

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Hisobingiz bloklangan. Qo\'llab-quvvatlash xizmatiga murojaat qiling.' },
        { status: 403 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Email yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }

    // Generate signed HMAC session token
    const sessionToken = createSessionToken(user.id, user.role, user.email)

    const response = NextResponse.json({
      success: true,
      message: 'Tizimga muvaffaqiyatli kirildi',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })

    // Set secure HTTP-only session cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    response.cookies.set('user_role', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (err: any) {
    console.error('Login Error:', err)
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi. Qayta urinib ko\'ring.' },
      { status: 500 }
    )
  }
}
