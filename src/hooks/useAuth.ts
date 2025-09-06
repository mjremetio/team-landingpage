'use client'

import { useState, useEffect } from 'react'

interface User {
  userId: string
  username: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (data.success) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        })
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        user: null,
        loading: false,
        error: 'Failed to check authentication status'
      })
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthState({
        user: null,
        loading: false,
        error: null
      })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshAuth = () => {
    checkAuthStatus()
  }

  return {
    ...authState,
    logout,
    refreshAuth
  }
}