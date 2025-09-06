'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Award, Target, Eye, Heart, Building } from 'lucide-react'
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
            {content?.teamStory && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {content.teamStory}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission & Vision */}
            <div className="space-y-6">
              {content?.mission && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.mission}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content?.vision && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.vision}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Values & Company Info */}
            <div className="space-y-6">
              {content?.values && content.values.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Our Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {content.values.map((value: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-muted-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {content?.companyInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Company Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {content.companyInfo.founded && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span className="font-medium">{content.companyInfo.founded}</span>
                      </div>
                    )}
                    {content.companyInfo.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{content.companyInfo.location}</span>
                      </div>
                    )}
                    {content.companyInfo.size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size:</span>
                        <span className="font-medium">{content.companyInfo.size}</span>
                      </div>
                    )}
                    {content.companyInfo.industry && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry:</span>
                        <span className="font-medium">{content.companyInfo.industry}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Achievements */}
          {content?.achievements && content.achievements.length > 0 && (
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Our Achievements
                  </CardTitle>
                  <CardDescription>
                    Key milestones and accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="p-6 border rounded-lg bg-muted/50 text-center">
                        <div className="text-2xl font-bold text-primary mb-2">{achievement.year}</div>
                        <h3 className="font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}