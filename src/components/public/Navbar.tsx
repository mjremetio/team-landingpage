'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ]

  const scrollToSection = (sectionId: string) => {
    if (pathname === '/') {
      const element = document.querySelector(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setMobileMenuOpen(false)
      }
    }
  }

  const getHref = (item: { name: string; href: string }) => {
    if (pathname === '/' && ['About', 'Projects', 'Contact'].includes(item.name)) {
      return `#${item.name.toLowerCase()}`
    }
    return item.href
  }

  const handleNavClick = (item: { name: string; href: string }, e: React.MouseEvent) => {
    if (pathname === '/' && ['About', 'Projects', 'Contact'].includes(item.name)) {
      e.preventDefault()
      scrollToSection(`#${item.name.toLowerCase()}`)
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-xl">
              Portfolio
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const href = getHref(item)
                const isActive = pathname === item.href || 
                  (pathname === '/' && href.startsWith('#'))
                
                return (
                  <Link
                    key={item.name}
                    href={href}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* CTA Button */}
              <Button asChild>
                <Link href="#contact" onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault()
                    scrollToSection('#contact')
                  }
                }}>
                  Get in Touch
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-bold text-lg">Menu</span>
                    </div>
                    
                    <nav className="flex flex-col space-y-6">
                      {navigation.map((item) => {
                        const href = getHref(item)
                        const isActive = pathname === item.href || 
                          (pathname === '/' && href.startsWith('#'))
                        
                        return (
                          <Link
                            key={item.name}
                            href={href}
                            onClick={(e) => {
                              handleNavClick(item, e)
                              setMobileMenuOpen(false)
                            }}
                            className={`text-lg font-medium transition-colors hover:text-primary ${
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      })}
                    </nav>

                    <div className="mt-auto pt-6 border-t">
                      <Button asChild className="w-full">
                        <Link href="#contact" onClick={(e) => {
                          if (pathname === '/') {
                            e.preventDefault()
                            scrollToSection('#contact')
                          }
                          setMobileMenuOpen(false)
                        }}>
                          Get in Touch
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}