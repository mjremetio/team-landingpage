import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // If no token, redirect to sign in
      if (!req.nextauth.token) {
        return NextResponse.redirect(
          new URL('/api/auth/signin', req.url)
        )
      }
      
      // Check if admin email is configured
      if (!process.env.ADMIN_EMAIL) {
        // If no admin email is configured, show a setup message
        return NextResponse.redirect(
          new URL('/', req.url)
        )
      }
      
      // Check if user is admin
      const isAdmin = req.nextauth.token.email === process.env.ADMIN_EMAIL
      if (!isAdmin) {
        return NextResponse.redirect(
          new URL('/api/auth/signin', req.url)
        )
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all non-admin routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true
        }
        
        // For admin routes, check if user exists and is admin
        return process.env.ADMIN_EMAIL ? token?.email === process.env.ADMIN_EMAIL : false
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/projects/:path*',
    '/api/sections/:path*',
    '/api/upload/:path*'
  ],
}