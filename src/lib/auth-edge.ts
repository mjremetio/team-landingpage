import CryptoJS from 'crypto-js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

// Simple JWT implementation for Edge Runtime
export class EdgeAuth {
  static verify(token: string): { success: boolean; user?: any } {
    try {
      const [headerEncoded, payloadEncoded, signature] = token.split('.')
      
      const expectedSignature = CryptoJS.HmacSHA256(`${headerEncoded}.${payloadEncoded}`, JWT_SECRET).toString(CryptoJS.enc.Base64url)
      
      if (signature !== expectedSignature) {
        return { success: false }
      }
      
      const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString())
      
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return { success: false }
      }
      
      return { success: true, user: payload }
    } catch (error) {
      return { success: false }
    }
  }
}