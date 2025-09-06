import * as fs from 'fs'
import * as path from 'path'
import CryptoJS from 'crypto-js'

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
const ENCRYPTION_KEY = process.env.AUTH_ENCRYPTION_KEY || 'your-secret-auth-encryption-key-change-in-production'
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

interface UsersFile {
  users: Record<string, User>
  userIds: string[]
}

// Simple JWT implementation
class SimpleJWT {
  static sign(payload: any, secret: string, options: { expiresIn: string }): string {
    const header = { alg: 'HS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const exp = now + this.parseExpiry(options.expiresIn)
    
    const jwtPayload = { ...payload, iat: now, exp }
    
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadEncoded = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url')
    const signature = CryptoJS.HmacSHA256(`${headerEncoded}.${payloadEncoded}`, secret).toString(CryptoJS.enc.Base64url)
    
    return `${headerEncoded}.${payloadEncoded}.${signature}`
  }
  
  static verify(token: string, secret: string): any {
    const [headerEncoded, payloadEncoded, signature] = token.split('.')
    
    const expectedSignature = CryptoJS.HmacSHA256(`${headerEncoded}.${payloadEncoded}`, secret).toString(CryptoJS.enc.Base64url)
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature')
    }
    
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString())
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired')
    }
    
    return payload
  }
  
  static parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1)
    const value = parseInt(expiry.slice(0, -1))
    
    switch (unit) {
      case 'd': return value * 24 * 60 * 60
      case 'h': return value * 60 * 60
      case 'm': return value * 60
      case 's': return value
      default: return value
    }
  }
}

// Simple bcrypt implementation
class SimpleBcrypt {
  static async hash(password: string, rounds: number = 12): Promise<string> {
    // Simple implementation - in production, use real bcrypt
    const salt = CryptoJS.lib.WordArray.random(16).toString()
    let hashed = password + salt
    for (let i = 0; i < rounds; i++) {
      hashed = CryptoJS.SHA256(hashed).toString()
    }
    return `$2b$${rounds}$${salt}$${hashed}`
  }
  
  static async compare(password: string, hash: string): Promise<boolean> {
    const parts = hash.split('$')
    if (parts.length !== 5) return false  // $2b$rounds$salt$hash
    
    const rounds = parseInt(parts[2])
    const salt = parts[3]
    const expectedHash = parts[4]
    
    let hashed = password + salt
    for (let i = 0; i < rounds; i++) {
      hashed = CryptoJS.SHA256(hashed).toString()
    }
    
    return hashed === expectedHash
  }
}

export class Auth {
  // Ensure data directory exists
  static ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  }

  // Encrypt data before saving
  static encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
  }

  // Decrypt data after loading
  static decryptData<T>(encryptedData: string): T {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }

  // Load users from encrypted file
  static loadUsersFile(): UsersFile {
    this.ensureDataDir()
    if (!fs.existsSync(USERS_FILE)) {
      return { users: {}, userIds: [] }
    }
    try {
      const encryptedData = fs.readFileSync(USERS_FILE, 'utf8')
      return this.decryptData<UsersFile>(encryptedData)
    } catch (error) {
      console.error('Error loading users file:', error)
      return { users: {}, userIds: [] }
    }
  }

  // Save users to encrypted file
  static saveUsersFile(data: UsersFile) {
    this.ensureDataDir()
    const encryptedData = this.encryptData(data)
    fs.writeFileSync(USERS_FILE, encryptedData, 'utf8')
  }

  static async initializeDefaultAdmin() {
    try {
      const data = this.loadUsersFile()
      if (data.userIds.length === 0) {
        const hashedPassword = await SimpleBcrypt.hash('admin123', 12)
        const defaultAdmin: User = {
          id: 'admin_1',
          username: 'admin',
          email: 'admin@portfolio.com',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date()
        }
        
        data.users[defaultAdmin.id] = defaultAdmin
        data.userIds.push(defaultAdmin.id)
        this.saveUsersFile(data)
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
      
      const data = this.loadUsersFile()
      const user = Object.values(data.users).find(u => u.username === username || u.email === username)

      if (!user) {
        return { success: false, message: 'Invalid credentials' }
      }

      const isValidPassword = await SimpleBcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return { success: false, message: 'Invalid credentials' }
      }

      const token = SimpleJWT.sign(
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
      const decoded = SimpleJWT.verify(token, JWT_SECRET)
      return { success: true, user: decoded }
    } catch (error) {
      return { success: false }
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { password: string }): Promise<AuthResult> {
    try {
      const data = this.loadUsersFile()
      
      // Check if user already exists
      const existingUser = Object.values(data.users).find(u => u.username === userData.username || u.email === userData.email)
      if (existingUser) {
        return { success: false, message: 'User already exists' }
      }

      const hashedPassword = await SimpleBcrypt.hash(userData.password, 12)
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        createdAt: new Date()
      }

      data.users[newUser.id] = newUser
      data.userIds.push(newUser.id)
      this.saveUsersFile(data)

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
      const data = this.loadUsersFile()
      return Object.values(data.users).map(({ password: _, ...user }) => user)
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