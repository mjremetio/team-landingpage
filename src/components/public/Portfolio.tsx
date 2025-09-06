'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ExternalLink, 
  Github, 
  Search, 
  Filter, 
  FolderOpen,
  Star,
  Calendar
} from 'lucide-react'
import { Project } from '@/types'

export function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAll, setShowAll] = useState(false)
  
  const categories = ['Web Development', 'Mobile Apps', 'Desktop Apps', 'UI/UX Design', 'Backend APIs', 'Machine Learning', 'Other']

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?featured=true&limit=6')
      const result = await response.json()
      
      if (result.data) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '50',
      })

      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/projects?${params}`)
      const result = await response.json()
      
      if (result.data) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching all projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewAll = () => {
    setShowAll(true)
    fetchAllProjects()
  }

  const handleSearch = () => {
    if (showAll) {
      fetchAllProjects()
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || project.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const displayProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  if (loading && !showAll) {
    return (
      <section id="portfolio" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto animate-pulse mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <div className="h-48 bg-muted rounded-t-lg animate-pulse" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and personal projects
            </p>
          </div>

          {/* Search and Filter */}
          {showAll && (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {displayProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Projects will appear here once they are added'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 bg-muted overflow-hidden">
                    {project.images.length > 0 ? (
                      <>
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.featured && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500 text-yellow-50">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FolderOpen className="w-12 h-12 text-muted-foreground" />
                        {project.featured && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500 text-yellow-50">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Overlay with Quick Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      {project.liveUrl && (
                        <Button size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Live
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        <Link href={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.liveUrl && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/projects/${project.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All Button */}
          {!showAll && projects.length >= 6 && (
            <div className="text-center mt-12">
              <Button onClick={handleViewAll} size="lg" variant="outline">
                View All Projects
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Results Summary */}
          {showAll && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                Showing {displayProjects.length} of {filteredProjects.length} projects
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                    fetchAllProjects()
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}