'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Code2, Database, Palette, Server, Globe, Smartphone } from 'lucide-react'
import { ToolsSection } from '@/types'

export function Tools() {
  const [content, setContent] = useState<ToolsSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.tools) {
        setContent(result.data.tools.content)
      }
    } catch (error) {
      console.error('Error fetching tools content:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('frontend') || name.includes('ui') || name.includes('design')) {
      return Palette
    } else if (name.includes('backend') || name.includes('server')) {
      return Server
    } else if (name.includes('database') || name.includes('data')) {
      return Database
    } else if (name.includes('mobile')) {
      return Smartphone
    } else if (name.includes('web')) {
      return Globe
    }
    return Code2
  }

  const getProficiencyLevel = (proficiency: number) => {
    if (proficiency >= 90) return 'Expert'
    if (proficiency >= 75) return 'Advanced'
    if (proficiency >= 60) return 'Intermediate'
    if (proficiency >= 40) return 'Beginner'
    return 'Learning'
  }

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'bg-green-500'
    if (proficiency >= 75) return 'bg-blue-500'
    if (proficiency >= 60) return 'bg-yellow-500'
    if (proficiency >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <section id="tools" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto animate-pulse mb-4" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-2 bg-muted rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
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
    <section id="tools" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            {content?.title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {content.title}
              </h2>
            )}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The technologies, frameworks, and tools I use to bring ideas to life
            </p>
          </div>

          {/* Tools Grid */}
          {content?.categories && content.categories.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.categories.map((category, categoryIndex) => {
                const CategoryIcon = getCategoryIcon(category.name)
                
                return (
                  <Card key={categoryIndex} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CategoryIcon className="w-5 h-5 text-primary" />
                        <span>{category.name}</span>
                      </CardTitle>
                      <CardDescription>
                        {category.tools.length} tool{category.tools.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.tools.map((tool, toolIndex) => (
                          <div key={toolIndex} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{tool.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {getProficiencyLevel(tool.proficiency)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {tool.proficiency}%
                                </span>
                              </div>
                            </div>
                            <div className="relative">
                              <Progress value={tool.proficiency} className="h-2" />
                              <div 
                                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${getProficiencyColor(tool.proficiency)}`}
                                style={{ width: `${tool.proficiency}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Skills Summary */}
          {content?.categories && (
            <div className="mt-16 text-center">
              <div className="inline-flex flex-wrap gap-2 justify-center">
                {content.categories.flatMap(cat => 
                  cat.tools.map(tool => (
                    <Badge key={`${cat.name}-${tool.name}`} variant="outline">
                      {tool.name}
                    </Badge>
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                And always learning more...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}