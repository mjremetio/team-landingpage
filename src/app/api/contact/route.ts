import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ContactFormData } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <noreply@yourdomain.com>',
        to: [adminEmail],
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from your portfolio contact form.</p>
            </div>
          </div>
        `,
        replyTo: email,
      })

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully. I\'ll get back to you soon!',
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}