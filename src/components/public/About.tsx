'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Award } from 'lucide-react'
import { AboutSection } from '@/types'

export function About() {
  const [content, setContent] = useState<AboutSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.about) {
        setContent(result.data.about.content)
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto animate-pulse mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
              </div>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            {content?.title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {content.title}
              </h2>
            )}
            {content?.biography && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {content.biography}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Skills Section */}
            {content?.skills && content.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Skills & Technologies</span>
                  </CardTitle>
                  <CardDescription>
                    Technologies and tools I work with regularly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {content.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            {content?.experience && content.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarDays className="w-5 h-5" />
                    <span>Experience</span>
                  </CardTitle>
                  <CardDescription>
                    My professional journey and key milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {content.experience.map((exp, index) => (
                      <div key={index} className="relative">
                        {/* Timeline connector */}
                        {index < content.experience.length - 1 && (
                          <div className="absolute left-0 top-8 w-px h-16 bg-border" />
                        )}
                        
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <h4 className="font-semibold text-foreground">
                                {exp.role}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {exp.duration}
                              </span>
                            </div>
                            <p className="text-primary font-medium mb-2">
                              {exp.company}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Certifications */}
          {content?.certifications && content.certifications.length > 0 && (
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Certifications</span>
                </CardTitle>
                <CardDescription>
                  Professional certifications and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <p className="font-medium">{cert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}