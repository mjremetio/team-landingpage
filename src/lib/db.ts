import * as fs from 'fs'
import * as path from 'path'
import CryptoJS from 'crypto-js'
import { Project, Section, TeamMember } from '@/types'

// Database utility functions for encrypted JSON file storage

const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || 'your-secret-encryption-key-change-in-production'
const DATA_DIR = path.join(process.cwd(), 'data')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')
const SECTIONS_FILE = path.join(DATA_DIR, 'sections.json')
const TEAM_MEMBERS_FILE = path.join(DATA_DIR, 'team-members.json')

interface DatabaseFile {
  projects: Record<string, Project>
  projectIds: string[]
  projectSlugs: Record<string, string>
}

interface SectionsFile {
  sections: Record<string, Section>
}

interface TeamMembersFile {
  members: Record<string, TeamMember>
  memberIds: string[]
}

export class Database {
  // Ensure data directory exists
  static ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  }

  // Encrypt data before saving
  static encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
  }

  // Decrypt data after loading
  static decryptData<T>(encryptedData: string): T {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }

  // Load projects from encrypted file
  static loadProjectsFile(): DatabaseFile {
    this.ensureDataDir()
    if (!fs.existsSync(PROJECTS_FILE)) {
      return { projects: {}, projectIds: [], projectSlugs: {} }
    }
    try {
      const encryptedData = fs.readFileSync(PROJECTS_FILE, 'utf8')
      return this.decryptData<DatabaseFile>(encryptedData)
    } catch (error) {
      console.error('Error loading projects file:', error)
      return { projects: {}, projectIds: [], projectSlugs: {} }
    }
  }

  // Save projects to encrypted file
  static saveProjectsFile(data: DatabaseFile) {
    this.ensureDataDir()
    const encryptedData = this.encryptData(data)
    fs.writeFileSync(PROJECTS_FILE, encryptedData, 'utf8')
  }

  // Load sections from encrypted file
  static loadSectionsFile(): SectionsFile {
    this.ensureDataDir()
    if (!fs.existsSync(SECTIONS_FILE)) {
      return { sections: {} }
    }
    try {
      const encryptedData = fs.readFileSync(SECTIONS_FILE, 'utf8')
      return this.decryptData<SectionsFile>(encryptedData)
    } catch (error) {
      console.error('Error loading sections file:', error)
      return { sections: {} }
    }
  }

  // Save sections to encrypted file
  static saveSectionsFile(data: SectionsFile) {
    this.ensureDataDir()
    const encryptedData = this.encryptData(data)
    fs.writeFileSync(SECTIONS_FILE, encryptedData, 'utf8')
  }

  // Load team members from encrypted file
  static loadTeamMembersFile(): TeamMembersFile {
    this.ensureDataDir()
    if (!fs.existsSync(TEAM_MEMBERS_FILE)) {
      return { members: {}, memberIds: [] }
    }
    try {
      const encryptedData = fs.readFileSync(TEAM_MEMBERS_FILE, 'utf8')
      return this.decryptData<TeamMembersFile>(encryptedData)
    } catch (error) {
      console.error('Error loading team members file:', error)
      return { members: {}, memberIds: [] }
    }
  }

  // Save team members to encrypted file
  static saveTeamMembersFile(data: TeamMembersFile) {
    this.ensureDataDir()
    const encryptedData = this.encryptData(data)
    fs.writeFileSync(TEAM_MEMBERS_FILE, encryptedData, 'utf8')
  }
  // Project operations
  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const slug = this.generateSlug(project.title)
    const now = new Date()
    
    const newProject: Project = {
      ...project,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    }
    
    const data = this.loadProjectsFile()
    data.projects[id] = newProject
    data.projectIds.push(id)
    data.projectSlugs[slug] = id
    this.saveProjectsFile(data)
    
    return newProject
  }

  static async getProject(id: string): Promise<Project | null> {
    const data = this.loadProjectsFile()
    const project = data.projects[id]
    if (!project) {
      return null
    }
    
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    const data = this.loadProjectsFile()
    const id = data.projectSlugs[slug]
    if (!id) return null
    return this.getProject(id)
  }

  static async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
    const existing = await this.getProject(id)
    if (!existing) return null
    
    const data = this.loadProjectsFile()
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
      delete data.projectSlugs[existing.slug]
      data.projectSlugs[newSlug] = id
      updatedProject.slug = newSlug
    }
    
    data.projects[id] = updatedProject
    this.saveProjectsFile(data)
    return updatedProject
  }

  static async deleteProject(id: string): Promise<boolean> {
    const project = await this.getProject(id)
    if (!project) return false
    
    const data = this.loadProjectsFile()
    delete data.projects[id]
    data.projectIds = data.projectIds.filter(pid => pid !== id)
    delete data.projectSlugs[project.slug]
    this.saveProjectsFile(data)
    
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
    
    const data = this.loadProjectsFile()
    let projects: Project[] = []
    
    for (const id of data.projectIds) {
      const project = data.projects[id]
      if (project) {
        projects.push({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        })
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
    const data = this.loadSectionsFile()
    const section = data.sections[type]
    if (!section) {
      return null
    }
    
    return {
      ...section,
      updatedAt: new Date(section.updatedAt),
    }
  }

  static async updateSection(type: Section['type'], content: Record<string, unknown>): Promise<Section> {
    const section: Section = {
      id: `section_${type}`,
      type,
      content,
      updatedAt: new Date(),
    }
    
    const data = this.loadSectionsFile()
    data.sections[type] = section
    this.saveSectionsFile(data)
    
    return section
  }

  static async getAllSections(): Promise<Record<string, Section>> {
    const sectionTypes: Section['type'][] = ['hero', 'about', 'team', 'tools', 'contact', 'footer']
    const sections: Record<string, Section> = {}
    
    for (const type of sectionTypes) {
      const section = await this.getSection(type)
      if (section) {
        sections[type] = section
      }
    }
    
    return sections
  }

  // Team Member operations
  static async createTeamMember(member: Omit<TeamMember, 'id' | 'joinedDate'>): Promise<TeamMember> {
    const id = `member_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const joinedDate = new Date()
    
    const newMember: TeamMember = {
      ...member,
      id,
      joinedDate,
      isActive: true,
    }
    
    const data = this.loadTeamMembersFile()
    data.members[id] = newMember
    data.memberIds.push(id)
    this.saveTeamMembersFile(data)
    
    return newMember
  }

  static async getTeamMember(id: string): Promise<TeamMember | null> {
    const data = this.loadTeamMembersFile()
    const member = data.members[id]
    if (!member) {
      return null
    }
    
    return {
      ...member,
      joinedDate: new Date(member.joinedDate),
    }
  }

  static async updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id' | 'joinedDate'>>): Promise<TeamMember | null> {
    const existing = await this.getTeamMember(id)
    if (!existing) return null
    
    const data = this.loadTeamMembersFile()
    const updatedMember: TeamMember = {
      ...existing,
      ...updates,
      id: existing.id,
      joinedDate: existing.joinedDate,
    }
    
    data.members[id] = updatedMember
    this.saveTeamMembersFile(data)
    return updatedMember
  }

  static async deleteTeamMember(id: string): Promise<boolean> {
    const member = await this.getTeamMember(id)
    if (!member) return false
    
    const data = this.loadTeamMembersFile()
    delete data.members[id]
    data.memberIds = data.memberIds.filter(mid => mid !== id)
    this.saveTeamMembersFile(data)
    
    return true
  }

  static async getAllTeamMembers(options: { activeOnly?: boolean } = {}): Promise<TeamMember[]> {
    const { activeOnly = false } = options
    
    const data = this.loadTeamMembersFile()
    let members: TeamMember[] = []
    
    for (const id of data.memberIds) {
      const member = data.members[id]
      if (member) {
        const processedMember = {
          ...member,
          joinedDate: new Date(member.joinedDate),
        }
        
        if (!activeOnly || processedMember.isActive) {
          members.push(processedMember)
        }
      }
    }
    
    // Sort by joinedDate desc
    members.sort((a, b) => b.joinedDate.getTime() - a.joinedDate.getTime())
    
    return members
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