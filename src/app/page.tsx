'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { About } from '@/components/public/About'
import { Tools } from '@/components/public/Tools'
import { Portfolio } from '@/components/public/Portfolio'
import { Contact } from '@/components/public/Contact'
import { Footer } from '@/components/public/Footer'
import { SetupWarning } from '@/components/public/SetupWarning'
import { Database } from '@/lib/db'
import { Auth } from '@/lib/auth'

export default function Home() {
  const [showSetupWarning, setShowSetupWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if basic environment variables are configured
    const checkSetup = () => {
      const hasBasicEnvVars = process.env.NEXT_PUBLIC_VERCEL_ENV || 
        (typeof window === 'undefined' && process.env.NODE_ENV === 'production')
      
      // In development, show setup warning if trying to access admin without config
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('setup') === 'required') {
          setShowSetupWarning(true)
          setIsLoading(false)
          return
        }
      }

      setShowSetupWarning(false)
      setIsLoading(false)
    }

    // Initialize default sections and admin user in the database
    const initializeData = async () => {
      if (!showSetupWarning) {
        try {
          await Database.initializeDefaultSections()
          await Auth.initializeDefaultAdmin()
        } catch (error) {
          console.error('Error initializing data:', error)
        }
      }
    }
    
    checkSetup()
    initializeData()
  }, [showSetupWarning])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showSetupWarning) {
    return <SetupWarning />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tools />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
