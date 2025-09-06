import { Navbar } from '@/components/public/Navbar'
import { Portfolio } from '@/components/public/Portfolio'
import { Footer } from '@/components/public/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects - Portfolio',
  description: 'Browse through my portfolio of web development projects and technical work.',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <Portfolio />
      </div>
      <Footer />
    </div>
  )
}