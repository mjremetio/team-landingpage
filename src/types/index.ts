// TypeScript definitions for the team portfolio system

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  skills: string[]
  experience: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
    portfolio?: string
  }
  joinedDate: Date
  isActive: boolean
  specialties: string[]
}

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
  teamMembers: string[] // Array of team member IDs
  projectLead?: string // Team member ID
  collaborationNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Section {
  id: string
  type: 'hero' | 'about' | 'team' | 'tools' | 'contact' | 'footer'
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
  teamHighlight: {
    memberCount: number
    foundedYear?: number
    location?: string
  }
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
    website?: string
  }
}

export interface AboutSection {
  title: string
  mission: string
  vision: string
  values: string[]
  teamStory: string
  achievements: {
    title: string
    description: string
    year: number
  }[]
  companyInfo: {
    founded?: number
    location?: string
    size?: string
    industry?: string
  }
}

export interface TeamSection {
  title: string
  description: string
  displayFeatured: boolean
  memberIds: string[] // References to TeamMember ids
  departments: {
    name: string
    description: string
    memberIds: string[]
  }[]
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
  | TeamSection
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
  teamMembers: string[]
  projectLead?: string
  collaborationNotes?: string
  images: File[]
}

export interface TeamMemberFormData {
  name: string
  role: string
  bio: string
  skills: string[]
  experience: string
  specialties: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
    portfolio?: string
  }
  avatar?: File
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