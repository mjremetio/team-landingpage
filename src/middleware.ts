import { NextRequest, NextResponse } from 'next/server'
import { Auth } from './lib/auth'

export async function middleware(request: NextRequest) {
  // Check if user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify the token
    const result = await Auth.verifyToken(token)
    if (!result.success || result.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check for API admin routes
  if (request.nextUrl.pathname.startsWith('/api/admin') || 
      request.nextUrl.pathname.startsWith('/api/projects') ||
      request.nextUrl.pathname.startsWith('/api/sections') ||
      request.nextUrl.pathname.startsWith('/api/upload')) {
    
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const result = await Auth.verifyToken(token)
    if (!result.success || result.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/projects/:path*',
    '/api/sections/:path*',
    '/api/upload/:path*'
  ],
}