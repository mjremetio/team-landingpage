'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import { Project } from '@/types'

interface ProjectPageProps {
  params: { slug: string }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [params.slug])

  const fetchProject = async () => {
    try {
      // Get project by slug (we need to fetch all and find by slug)
      const response = await fetch('/api/projects?limit=100')
      const result = await response.json()
      
      if (result.data) {
        const foundProject = result.data.find((p: Project) => p.slug === params.slug)
        if (foundProject) {
          setProject(foundProject)
        } else {
          notFound()
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-muted rounded w-1/4 animate-pulse mb-6" />
              <div className="h-12 bg-muted rounded w-3/4 animate-pulse mb-4" />
              <div className="h-6 bg-muted rounded w-1/2 animate-pulse mb-8" />
              <div className="h-96 bg-muted rounded animate-pulse mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!project) {
    return notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <Link href="/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </div>

            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{project.category}</Badge>
                {project.featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
                <div className="flex items-center text-muted-foreground text-sm ml-auto">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {project.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Project Images */}
            {project.images.length > 0 && (
              <div className="mb-12">
                <div className="grid gap-4">
                  {/* Main Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={project.images[0]}
                      alt={`${project.title} - Main Screenshot`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {project.images.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.images.slice(1).map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <img
                            src={image}
                            alt={`${project.title} - Screenshot ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(image, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technologies Used */}
            {project.technologies.length > 0 && (
              <Card className="mb-12">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Details */}
            <Card className="mb-12">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    This project showcases modern web development practices and demonstrates 
                    proficiency in the technologies listed above. The implementation focuses 
                    on performance, accessibility, and user experience.
                  </p>
                  
                  {project.liveUrl && (
                    <p>
                      <strong>Live Demo:</strong> The project is deployed and accessible 
                      at{' '}
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {project.liveUrl}
                      </a>
                    </p>
                  )}
                  
                  {project.githubUrl && (
                    <p>
                      <strong>Source Code:</strong> The complete source code is available 
                      on{' '}
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        GitHub
                      </a>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Interested in working together?
              </h3>
              <Button asChild size="lg">
                <Link href="/#contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}