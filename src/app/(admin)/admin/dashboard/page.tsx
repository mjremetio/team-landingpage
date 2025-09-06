'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, FileText, Upload, Mail, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalSections: 5, // Fixed number of sections
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch projects data
      const projectsResponse = await fetch('/api/projects?limit=5')
      const projectsData = await projectsResponse.json()
      
      if (projectsData.data) {
        setRecentProjects(projectsData.data)
        
        // Calculate stats
        const totalProjects = projectsData.pagination?.total || 0
        const featuredProjects = projectsData.data.filter((p: Project) => p.featured).length
        
        setStats(prev => ({
          ...prev,
          totalProjects,
          featuredProjects
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new portfolio project',
      href: '/admin/projects/new',
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Edit Sections',
      description: 'Update homepage content',
      href: '/admin/sections',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Upload Files',
      description: 'Manage project images',
      href: '/admin/projects',
      icon: Upload,
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your admin panel</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio projects created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProjects}</div>
            <p className="text-xs text-muted-foreground">
              Highlighted on homepage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Sections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSections}</div>
            <p className="text-xs text-muted-foreground">
              Hero, About, Tools, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Badge variant="default" className="bg-green-500">Online</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-md ${action.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={action.href}>Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest portfolio additions</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/projects">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-6">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first project
              </p>
              <Button asChild>
                <Link href="/admin/projects/new">Add Project</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{project.title}</h4>
                      {project.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {project.technologies.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.slug}`} target="_blank">View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}