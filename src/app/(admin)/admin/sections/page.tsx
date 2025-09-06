'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionEditor } from '@/components/admin/SectionEditor'
import { Section, SectionContent } from '@/types'
import { Home, User, Wrench, Mail, FileText } from 'lucide-react'

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Record<string, Section>>({})
  const [loading, setLoading] = useState(true)

  const sectionConfig = {
    hero: { name: 'Hero Section', icon: Home, description: 'Main landing section with your introduction' },
    about: { name: 'About Section', icon: User, description: 'Your biography, skills, and experience' },
    tools: { name: 'Tools Section', icon: Wrench, description: 'Technologies and tools you use' },
    contact: { name: 'Contact Section', icon: Mail, description: 'Contact information and form' },
    footer: { name: 'Footer Section', icon: FileText, description: 'Footer links and copyright' },
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success) {
        setSections(result.data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (sectionType: Section['type'], content: SectionContent) => {
    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionType,
          content,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        // Update local state
        setSections(prev => ({
          ...prev,
          [sectionType]: result.data,
        }))
        alert('Section updated successfully!')
      } else {
        alert(result.error || 'Failed to update section')
      }
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Failed to save section. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 mt-2 animate-pulse" />
        </div>
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Sections</h1>
        <p className="text-muted-foreground">
          Manage the content sections of your portfolio homepage
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(sectionConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Object.entries(sectionConfig).map(([sectionType, config]) => (
          <TabsContent key={sectionType} value={sectionType}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <config.icon className="w-5 h-5" />
                  <span>{config.name}</span>
                </CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <SectionEditor
                  section={sectionType as Section['type']}
                  content={sections[sectionType]?.content || {}}
                  onSave={(content) => handleSaveSection(sectionType as Section['type'], content)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}