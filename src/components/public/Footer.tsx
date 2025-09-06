'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react'
import { FooterSection } from '@/types'

export function Footer() {
  const [content, setContent] = useState<FooterSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.footer) {
        setContent(result.data.footer.content)
      }
    } catch (error) {
      console.error('Error fetching footer content:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  if (loading) {
    return (
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="h-4 bg-muted rounded w-64 mx-auto animate-pulse" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-background border-t relative">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand/About */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4">Portfolio</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                A passionate developer creating modern web applications and digital experiences. 
                Always learning, always building.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="mailto:contact@example.com">
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">
                    Tools
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {content?.links && content.links.length > 0 ? (
                  content.links.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.url} 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                        All Projects
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                        About Me
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                        Get in Touch
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm">
                {content?.copyrightText || `© ${currentYear} Portfolio. All rights reserved.`}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Built with Next.js & Tailwind CSS</span>
                <span>•</span>
                <span>Hosted on Vercel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        className="fixed bottom-6 right-6 z-50 shadow-lg"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    </footer>
  )
}