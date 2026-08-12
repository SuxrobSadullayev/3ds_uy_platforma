import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    const payload = verifySessionToken(sessionToken)

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Avtorizatsiyadan o\'tilmagan' },
        { status: 401 }
      )
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isBlocked: users.isBlocked,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))

    if (!user || user.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Foydalanuvchi topilmadi yoki hisob bloklangan' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (err: any) {
    console.error('Auth /me Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  // Logout handler
  const response = NextResponse.json({ success: true, message: 'Tizimdan chiqildi' })
  response.cookies.delete('session_token')
  response.cookies.delete('user_role')
  return response
}
