import { Navbar } from '@/components/public/Navbar'
import { Contact } from '@/components/public/Contact'
import { Footer } from '@/components/public/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Portfolio',
  description: 'Get in touch with me for project collaborations, job opportunities, or just to say hello.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </div>
  )
}