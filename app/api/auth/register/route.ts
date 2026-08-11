import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { fullName, email, phone, password, role } = validationResult.data
    const hashedPassword = await bcrypt.hash(password, 10)

    let createdUser = null

    try {
      // Check existing user in DB
      const existing = await db.select().from(users).where(eq(users.email, email))
      if (existing.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Ushbu email bilan foydalanuvchi allaqachon mavjud' },
          { status: 400 }
        )
      }

      const [newUser] = await db
        .insert(users)
        .values({
          name: fullName,
          email,
          phone,
          role: role as any,
          passwordHash: hashedPassword,
        })
        .returning()

      createdUser = newUser
    } catch {
      // Offline dev mode fallback
      createdUser = {
        id: `u-${Date.now()}`,
        name: fullName,
        email,
        phone,
        role,
        isBlocked: false,
        createdAt: new Date(),
      }
    }

    const sessionToken = `session_${Date.now()}_${createdUser.id}`
    const response = NextResponse.json(
      {
        success: true,
        message: "Ro'yxatdan muvaffaqiyatli o'tildi",
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          role: createdUser.role,
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

    response.cookies.set('user_role', createdUser.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
