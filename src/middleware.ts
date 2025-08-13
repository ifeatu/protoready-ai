import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Require login for assessments
    if (pathname.startsWith('/assessment') && pathname !== '/assessment' && !token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Admin routes - require admin role
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Consultant routes - require consultant role or admin
    if (pathname.startsWith('/consultant/dashboard') || pathname.startsWith('/consultant/bookings')) {
      if (!token || (token.role !== 'consultant' && token.role !== 'admin')) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // User dashboard routes - require any authenticated user
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url)
        signInUrl.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(signInUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public pages
        const publicPages = ['/', '/auth/signin', '/auth/signup', '/auth/error', '/consultant/apply']
        if (publicPages.includes(pathname)) {
          return true
        }

        // Assessment listing page is public, but submission requires auth
        if (pathname === '/assessment') {
          return true
        }

        // For protected routes, require token
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/assessment/submit/:path*',
    '/assessment/history/:path*', 
    '/admin/:path*',
    '/consultant/dashboard/:path*',
    '/consultant/bookings/:path*',
    '/dashboard/:path*',
    '/api/assessments/:path*',
    '/api/admin/:path*',
    '/api/consultant/:path*'
  ]
}