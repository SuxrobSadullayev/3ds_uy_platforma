import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route to required roles mapping
const PROTECTED_ROUTES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: '/admin', allowedRoles: ['super_admin', 'admin'] },
  { prefix: '/kompaniya', allowedRoles: ['company', 'super_admin'] },
  { prefix: '/investor', allowedRoles: ['investor', 'super_admin'] },
  { prefix: '/rieltor', allowedRoles: ['realtor', 'super_admin'] },
  { prefix: '/bank', allowedRoles: ['bank', 'super_admin'] },
  { prefix: '/davlat-operator', allowedRoles: ['state_operator', 'super_admin'] },
  { prefix: '/xaridor', allowedRoles: ['buyer', 'super_admin'] },
  { prefix: '/profil', allowedRoles: ['super_admin', 'company', 'buyer', 'investor', 'realtor', 'bank', 'state_operator'] },
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find matching protected route
  const protectedRoute = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix))

  if (protectedRoute) {
    const sessionToken =
      request.cookies.get('session_token')?.value ||
      request.cookies.get('better-auth.session_token')?.value
    const userRole = request.cookies.get('user_role')?.value || 'buyer'

    // If no session token, redirect to login page with callback URL
    if (!sessionToken) {
      const loginUrl = new URL('/kirish', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based Access Control Check
    if (!protectedRoute.allowedRoles.includes(userRole)) {
      // Redirect to unauthorized or home page
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
