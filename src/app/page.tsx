import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { About } from '@/components/public/About'
import { Team } from '@/components/public/Team'
import { Tools } from '@/components/public/Tools'
import { Portfolio } from '@/components/public/Portfolio'
import { Contact } from '@/components/public/Contact'
import { Footer } from '@/components/public/Footer'
import { Database } from '@/lib/db'
import { Auth } from '@/lib/auth'

// Server component to initialize data
async function initializeData() {
  try {
    await Database.initializeDefaultSections()
    await Auth.initializeDefaultAdmin()
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}

export default async function Home() {
  // Initialize data on server side
  await initializeData()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Team />
        <Tools />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}