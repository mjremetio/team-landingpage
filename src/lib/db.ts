import { kv } from '@vercel/kv'
import { Project, Section } from '@/types'

// Database utility functions for Vercel KV

export class Database {
  // Project operations
  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const slug = this.generateSlug(project.title)
    const now = new Date()
    
    const newProject: Project = {
      id,
      slug,
      createdAt: now,
      updatedAt: now,
      ...project,
    }
    
    await kv.hset(`project:${id}`, newProject)
    await kv.sadd('projects', id)
    
    // Update slug index
    await kv.hset('project_slugs', slug, id)
    
    return newProject
  }

  static async getProject(id: string): Promise<Project | null> {
    const project = await kv.hgetall(`project:${id}`)
    if (!project || Object.keys(project).length === 0) {
      return null
    }
    
    return {
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : JSON.parse(project.technologies as string || '[]'),
      images: Array.isArray(project.images) ? project.images : JSON.parse(project.images as string || '[]'),
      featured: Boolean(project.featured),
      createdAt: new Date(project.createdAt as string),
      updatedAt: new Date(project.updatedAt as string),
    } as Project
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    const id = await kv.hget('project_slugs', slug)
    if (!id) return null
    return this.getProject(id as string)
  }

  static async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
    const existing = await this.getProject(id)
    if (!existing) return null
    
    const updatedProject: Project = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    }
    
    // Update slug index if title changed
    if (updates.title && updates.title !== existing.title) {
      const newSlug = this.generateSlug(updates.title)
      await kv.hdel('project_slugs', existing.slug)
      await kv.hset('project_slugs', newSlug, id)
      updatedProject.slug = newSlug
    }
    
    await kv.hset(`project:${id}`, updatedProject)
    return updatedProject
  }

  static async deleteProject(id: string): Promise<boolean> {
    const project = await this.getProject(id)
    if (!project) return false
    
    await kv.del(`project:${id}`)
    await kv.srem('projects', id)
    await kv.hdel('project_slugs', project.slug)
    
    return true
  }

  static async getAllProjects(options: {
    page?: number
    limit?: number
    category?: string
    featured?: boolean
    search?: string
  } = {}): Promise<{ projects: Project[], total: number }> {
    const { page = 1, limit = 10, category, featured, search } = options
    
    const projectIds = await kv.smembers('projects') as string[]
    let projects: Project[] = []
    
    for (const id of projectIds) {
      const project = await this.getProject(id)
      if (project) {
        projects.push(project)
      }
    }
    
    // Apply filters
    if (category) {
      projects = projects.filter(p => p.category === category)
    }
    
    if (featured !== undefined) {
      projects = projects.filter(p => p.featured === featured)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.technologies.some(t => t.toLowerCase().includes(searchLower))
      )
    }
    
    // Sort by updatedAt desc
    projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    
    const total = projects.length
    const startIndex = (page - 1) * limit
    const paginatedProjects = projects.slice(startIndex, startIndex + limit)
    
    return { projects: paginatedProjects, total }
  }

  // Section operations
  static async getSection(type: Section['type']): Promise<Section | null> {
    const section = await kv.hgetall(`section:${type}`)
    if (!section || Object.keys(section).length === 0) {
      return null
    }
    
    return {
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content,
      updatedAt: new Date(section.updatedAt as string),
    } as Section
  }

  static async updateSection(type: Section['type'], content: Record<string, unknown>): Promise<Section> {
    const section: Section = {
      id: `section_${type}`,
      type,
      content,
      updatedAt: new Date(),
    }
    
    await kv.hset(`section:${type}`, {
      ...section,
      content: JSON.stringify(content),
    })
    
    return section
  }

  static async getAllSections(): Promise<Record<string, Section>> {
    const sectionTypes: Section['type'][] = ['hero', 'about', 'tools', 'contact', 'footer']
    const sections: Record<string, Section> = {}
    
    for (const type of sectionTypes) {
      const section = await this.getSection(type)
      if (section) {
        sections[type] = section
      }
    }
    
    return sections
  }

  // Utility functions
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Initialize default sections
  static async initializeDefaultSections(): Promise<void> {
    const sections = await this.getAllSections()
    
    if (!sections.hero) {
      await this.updateSection('hero', {
        title: "Full Stack Developer",
        subtitle: "Building Modern Web Applications",
        description: "I create beautiful, functional, and user-friendly websites and applications using cutting-edge technologies.",
        ctaText: "View My Work",
        ctaUrl: "#portfolio",
        socialLinks: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          email: "your.email@example.com"
        }
      })
    }

    if (!sections.about) {
      await this.updateSection('about', {
        title: "About Me",
        biography: "I'm a passionate full-stack developer with experience in modern web technologies. I love creating efficient, scalable applications that solve real-world problems.",
        skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "SQL", "MongoDB"],
        experience: [
          {
            company: "Your Company",
            role: "Full Stack Developer",
            duration: "2022 - Present",
            description: "Led development of multiple web applications using React and Node.js"
          }
        ],
        certifications: []
      })
    }

    if (!sections.tools) {
      await this.updateSection('tools', {
        title: "Tools & Technologies",
        categories: [
          {
            name: "Frontend",
            tools: [
              { name: "React", proficiency: 90 },
              { name: "Next.js", proficiency: 85 },
              { name: "TypeScript", proficiency: 80 },
              { name: "Tailwind CSS", proficiency: 85 }
            ]
          },
          {
            name: "Backend",
            tools: [
              { name: "Node.js", proficiency: 85 },
              { name: "Express", proficiency: 80 },
              { name: "PostgreSQL", proficiency: 75 },
              { name: "MongoDB", proficiency: 70 }
            ]
          }
        ]
      })
    }

    if (!sections.contact) {
      await this.updateSection('contact', {
        title: "Get In Touch",
        description: "I'm always open to discussing new opportunities and interesting projects.",
        email: "your.email@example.com",
        socialLinks: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername"
        }
      })
    }

    if (!sections.footer) {
      await this.updateSection('footer', {
        copyrightText: "© 2024 Your Name. All rights reserved.",
        links: [
          { name: "Privacy Policy", url: "/privacy" },
          { name: "Terms of Service", url: "/terms" }
        ]
      })
    }
  }
}

// Validation helpers
export function validateProject(data: unknown): data is Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
  if (typeof data !== 'object' || data === null) return false
  
  const project = data as Record<string, unknown>
  return (
    typeof project.title === 'string' &&
    typeof project.description === 'string' &&
    Array.isArray(project.technologies) &&
    Array.isArray(project.images) &&
    typeof project.category === 'string' &&
    typeof project.featured === 'boolean'
  )
}

export function validateSection(type: Section['type'], content: unknown): boolean {
  // Basic validation - can be extended based on specific section requirements
  return typeof content === 'object' && content !== null
}