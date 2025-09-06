'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react'
import { HeroSection } from '@/types'

export function Hero() {
  const [content, setContent] = useState<HeroSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.hero) {
        setContent(result.data.hero.content)
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToNext = () => {
    const nextSection = document.querySelector('#about')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = () => {
    if (content?.ctaUrl?.startsWith('#')) {
      const target = document.querySelector(content.ctaUrl)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    } else if (content?.ctaUrl) {
      window.open(content.ctaUrl, '_blank')
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return Github
      case 'linkedin':
        return Linkedin
      case 'email':
        return Mail
      default:
        return ExternalLink
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
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="h-12 bg-muted rounded w-2/3 mx-auto animate-pulse" />
          <div className="h-6 bg-muted rounded w-1/2 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse" />
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 relative">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              {content?.title && (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {content.title}
                  </span>
                </h1>
              )}
              
              {content?.subtitle && (
                <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
                  {content.subtitle}
                </h2>
              )}
            </div>

            {content?.description && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {content.description}
              </p>
            )}
          </div>

          {/* Call to Action and Social Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {content?.ctaText && (
              <Button size="lg" onClick={handleCtaClick} className="text-lg px-8 py-3">
                {content.ctaText}
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            )}

            {content?.socialLinks && (
              <div className="flex items-center space-x-4">
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
                          aria-label={`Visit my ${platform}`}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      </Button>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToNext}
              className="animate-bounce"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  )
}