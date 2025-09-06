'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react'
import { ContactSection, ContactFormData } from '@/types'

export function Contact() {
  const [content, setContent] = useState<ContactSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.contact) {
        setContent(result.data.contact.content)
      }
    } catch (error) {
      console.error('Error fetching contact content:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        reset()
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert(result.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return Github
      case 'linkedin':
        return Linkedin
      case 'twitter':
        return Twitter
      default:
        return Mail
    }
  }

  const getSocialUrl = (platform: string, url: string) => {
    if (platform === 'email') {
      return `mailto:${url}`
    }
    return url
  }

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto animate-pulse mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            {content?.title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {content.title}
              </h2>
            )}
            {content?.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {content.description}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        {...register('subject', { required: 'Subject is required' })}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters'
                          }
                        })}
                        placeholder="Tell me about your project, idea, or just say hello!"
                        rows={5}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  {content?.email && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href={`mailto:${content.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {content.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {content?.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a 
                          href={`tel:${content.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {content.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {content?.location && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{content.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {content?.socialLinks && Object.values(content.socialLinks).some(url => url) && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                  <div className="flex space-x-4">
                    {Object.entries(content.socialLinks)
                      .filter(([_, url]) => url)
                      .map(([platform, url]) => {
                        const Icon = getSocialIcon(platform)
                        const socialUrl = getSocialUrl(platform, url)
                        
                        return (
                          <Button
                            key={platform}
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <a
                              href={socialUrl}
                              target={platform === 'email' ? '_self' : '_blank'}
                              rel={platform === 'email' ? undefined : 'noopener noreferrer'}
                              aria-label={`Connect on ${platform}`}
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          </Button>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="p-6 bg-card border rounded-lg">
                <h4 className="font-semibold mb-2">Let&apos;s Work Together</h4>
                <p className="text-sm text-muted-foreground">
                  Whether you have a project in mind, need technical consultation, 
                  or just want to chat about technology, I&apos;d love to hear from you. 
                  I typically respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}