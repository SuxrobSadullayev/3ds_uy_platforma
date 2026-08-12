import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/auth/session'

// Protected route to required roles mapping
const PROTECTED_ROUTES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: '/admin', allowedRoles: ['super_admin', 'admin'] },
  { prefix: '/kompaniya', allowedRoles: ['company', 'super_admin'] },
  { prefix: '/investor', allowedRoles: ['investor', 'super_admin'] },
  { prefix: '/rieltor', allowedRoles: ['realtor', 'super_admin'] },
  { prefix: '/bank', allowedRoles: ['bank', 'super_admin'] },
  { prefix: '/davlat-operator', allowedRoles: ['state_operator', 'super_admin'] },
  { prefix: '/xaridor', allowedRoles: ['buyer', 'super_admin'] },
  {
    prefix: '/profil',
    allowedRoles: [
      'super_admin',
      'company',
      'buyer',
      'investor',
      'realtor',
      'bank',
      'state_operator',
    ],
  },
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find matching protected route
  const protectedRoute = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix))

  if (protectedRoute) {
    const sessionToken = request.cookies.get('session_token')?.value
    const sessionPayload = verifySessionToken(sessionToken)

    // If session token is missing or invalid/expired, redirect to login
    if (!sessionPayload) {
      const loginUrl = new URL('/kirish', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(loginUrl)
      // Clear invalid session cookies
      response.cookies.delete('session_token')
      response.cookies.delete('user_role')
      return response
    }

    // Role-based Access Control Check using cryptographically verified role
    if (!protectedRoute.allowedRoles.includes(sessionPayload.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/kompaniya/:path*',
    '/investor/:path*',
    '/rieltor/:path*',
    '/bank/:path*',
    '/davlat-operator/:path*',
    '/xaridor/:path*',
    '/profil/:path*',
  ],
}
