import { NextAuthOptions } from 'next-auth'
import { DefaultSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow admin users to sign in
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminEmail && user.email === adminEmail) {
        return true
      }
      
      // Reject sign in for non-admin users
      return false
    },
    async session({ session }) {
      // Add admin role to session
      if (session.user?.email === process.env.ADMIN_EMAIL) {
        return {
          ...session,
          user: {
            ...session.user,
            role: 'admin',
          },
        }
      }
      return session
    },
    async jwt({ token }) {
      // Add admin role to JWT token
      if (token.email === process.env.ADMIN_EMAIL) {
        token.role = 'admin'
      }
      return token
    },
  },
  pages: {
    signIn: '/api/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to check if user is admin
export function isAdmin(email: string | null | undefined): boolean {
  return email === process.env.ADMIN_EMAIL
}

// Type extension for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      role?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}