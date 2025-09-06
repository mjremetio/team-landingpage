import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: 'admin'
  createdAt: Date
}

export interface AuthResult {
  success: boolean
  token?: string
  user?: Omit<User, 'password'>
  message?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

// Simple in-memory storage for development
let users: User[] = []

export class Auth {
  static async initializeDefaultAdmin() {
    try {
      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 12)
        const defaultAdmin: User = {
          id: 'admin_1',
          username: 'admin',
          email: 'admin@portfolio.com',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        }
        
        users.push(defaultAdmin)
        console.log('Default admin user created: admin / admin123')
      }
    } catch (error) {
      console.error('Error initializing default admin:', error)
    }
  }

  static async login(username: string, password: string): Promise<AuthResult> {
    try {
      // Ensure default admin is initialized
      await this.initializeDefaultAdmin()
      
      const user = users.find(u => u.username === username || u.email === username)

      if (!user) {
        return { success: false, message: 'Invalid credentials' }
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return { success: false, message: 'Invalid credentials' }
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        token,
        user: userWithoutPassword
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed' }
    }
  }

  static async verifyToken(token: string): Promise<{ success: boolean; user?: any }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return { success: true, user: decoded }
    } catch (error) {
      return { success: false }
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<AuthResult> {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email)
      if (existingUser) {
        return { success: false, message: 'User already exists' }
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        createdAt: new Date()
      }

      users.push(newUser)

      const { password: _, ...userWithoutPassword } = newUser
      return {
        success: true,
        user: userWithoutPassword
      }
    } catch (error) {
      console.error('Create user error:', error)
      return { success: false, message: 'Failed to create user' }
    }
  }

  static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      return users.map(({ password: _, ...user }) => user)
    } catch (error) {
      console.error('Get users error:', error)
      return []
    }
  }
}

// Helper function to check if user is admin
export function isAdmin(role: string | null | undefined): boolean {
  return role === 'admin'
}