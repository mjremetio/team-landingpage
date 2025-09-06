import { Navbar } from '@/components/public/Navbar'
import { About } from '@/components/public/About'
import { Footer } from '@/components/public/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Portfolio',
  description: 'Learn more about my background, skills, and experience as a web developer.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <About />
      <Footer />
    </div>
  )
}