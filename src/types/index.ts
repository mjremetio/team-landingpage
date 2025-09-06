// TypeScript definitions for the portfolio system

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  technologies: string[]
  images: string[]
  liveUrl?: string
  githubUrl?: string
  category: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Section {
  id: string
  type: 'hero' | 'about' | 'tools' | 'contact' | 'footer'
  content: Record<string, unknown>
  updatedAt: Date
}

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaUrl: string
  backgroundImage?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export interface AboutSection {
  title: string
  biography: string
  skills: string[]
  experience: {
    company: string
    role: string
    duration: string
    description: string
  }[]
  certifications: string[]
}

export interface ToolsSection {
  title: string
  categories: {
    name: string
    tools: {
      name: string
      icon?: string
      proficiency: number
    }[]
  }[]
}

export interface ContactSection {
  title: string
  description: string
  email: string
  phone?: string
  location?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

export interface FooterSection {
  copyrightText: string
  links: {
    name: string
    url: string
  }[]
}

export type SectionContent = 
  | HeroSection 
  | AboutSection 
  | ToolsSection 
  | ContactSection 
  | FooterSection

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ProjectFormData {
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  category: string
  featured: boolean
  images: File[]
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}