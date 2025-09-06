import { NextRequest, NextResponse } from 'next/server'
import { Auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 })
    }

    const result = await Auth.verifyToken(token)

    if (!result.success) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: result.user })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}