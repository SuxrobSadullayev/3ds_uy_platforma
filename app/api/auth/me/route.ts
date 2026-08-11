import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    const userRole = cookieStore.get('user_role')?.value || 'buyer'

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Avtorizatsiyadan o\'tilmagan' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: sessionToken.split('_')[2] || 'demo-user-id',
        name: 'Suxrob Sadullayev',
        email: 'sadullaef@gmail.com',
        phone: '+998901234567',
        role: userRole,
        isVerified: true,
      },
    })
  } catch (err: any) {
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
