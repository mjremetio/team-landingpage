'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { About } from '@/components/public/About'
import { Tools } from '@/components/public/Tools'
import { Portfolio } from '@/components/public/Portfolio'
import { Contact } from '@/components/public/Contact'
import { Footer } from '@/components/public/Footer'
import { Database } from '@/lib/db'

export default function Home() {
  useEffect(() => {
    // Initialize default sections in the database
    const initializeData = async () => {
      try {
        await Database.initializeDefaultSections()
      } catch (error) {
        console.error('Error initializing default sections:', error)
      }
    }
    
    initializeData()
  }, [])

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
