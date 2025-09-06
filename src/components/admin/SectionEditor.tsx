/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Save } from 'lucide-react'
import { Section, SectionContent } from '@/types'

interface SectionEditorProps {
  section: Section['type']
  content: SectionContent
  onSave: (content: SectionContent) => Promise<void>
  isLoading?: boolean
}

export function SectionEditor({ section, content, onSave, isLoading = false }: SectionEditorProps) {
  const [formData, setFormData] = useState<any>(content)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addArrayItem = (field: string, item: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), item],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }))
  }

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => 
        i === index ? value : item
      ),
    }))
  }

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Main Title</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Full Stack Developer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Building Modern Web Applications"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Brief description of what you do..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ctaText">Call-to-Action Text</Label>
          <Input
            id="ctaText"
            value={formData.ctaText || ''}
            onChange={(e) => updateField('ctaText', e.target.value)}
            placeholder="View My Work"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
          <Input
            id="ctaUrl"
            value={formData.ctaUrl || ''}
            onChange={(e) => updateField('ctaUrl', e.target.value)}
            placeholder="#portfolio"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['github', 'linkedin', 'twitter', 'email'].map((platform) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
              <Input
                id={platform}
                value={formData.socialLinks?.[platform] || ''}
                onChange={(e) => updateField('socialLinks', {
                  ...formData.socialLinks,
                  [platform]: e.target.value
                })}
                placeholder={`Your ${platform} URL`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderAboutEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="About Me"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="biography">Biography</Label>
        <Textarea
          id="biography"
          value={formData.biography || ''}
          onChange={(e) => updateField('biography', e.target.value)}
          placeholder="Tell your story..."
          rows={6}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Skills</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const skill = prompt('Enter a skill:')
                if (skill) addArrayItem('skills', skill)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(formData.skills || []).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
                <button
                  type="button"
                  onClick={() => removeArrayItem('skills', index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Experience</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('experience', {
                company: '',
                role: '',
                duration: '',
                description: ''
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.experience || []).map((exp: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    value={exp.company}
                    onChange={(e) => updateArrayItem('experience', index, {
                      ...exp,
                      company: e.target.value
                    })}
                    placeholder="Company Name"
                  />
                  <Input
                    value={exp.role}
                    onChange={(e) => updateArrayItem('experience', index, {
                      ...exp,
                      role: e.target.value
                    })}
                    placeholder="Job Title"
                  />
                </div>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateArrayItem('experience', index, {
                    ...exp,
                    duration: e.target.value
                  })}
                  placeholder="Duration (e.g., 2022 - Present)"
                  className="mb-4"
                />
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateArrayItem('experience', index, {
                    ...exp,
                    description: e.target.value
                  })}
                  placeholder="Job description..."
                  rows={2}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('experience', index)}
                  className="mt-2"
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderToolsEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Tools & Technologies"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tool Categories</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('categories', {
                name: '',
                tools: []
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(formData.categories || []).map((category: any, catIndex: number) => (
            <Card key={catIndex}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    value={category.name}
                    onChange={(e) => updateArrayItem('categories', catIndex, {
                      ...category,
                      name: e.target.value
                    })}
                    placeholder="Category Name (e.g., Frontend)"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem('categories', catIndex)}
                  >
                    Remove Category
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tools</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedCategories = [...formData.categories]
                        updatedCategories[catIndex] = {
                          ...category,
                          tools: [...category.tools, { name: '', proficiency: 70 }]
                        }
                        setFormData(prev => ({ ...prev, categories: updatedCategories }))
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Tool
                    </Button>
                  </div>

                  {category.tools.map((tool: any, toolIndex: number) => (
                    <div key={toolIndex} className="flex items-center gap-2 p-2 border rounded">
                      <Input
                        value={tool.name}
                        onChange={(e) => {
                          const updatedCategories = [...formData.categories]
                          updatedCategories[catIndex].tools[toolIndex] = {
                            ...tool,
                            name: e.target.value
                          }
                          setFormData(prev => ({ ...prev, categories: updatedCategories }))
                        }}
                        placeholder="Tool name"
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Skill:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={tool.proficiency}
                          onChange={(e) => {
                            const updatedCategories = [...formData.categories]
                            updatedCategories[catIndex].tools[toolIndex] = {
                              ...tool,
                              proficiency: parseInt(e.target.value)
                            }
                            setFormData(prev => ({ ...prev, categories: updatedCategories }))
                          }}
                          className="w-16"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedCategories = [...formData.categories]
                          updatedCategories[catIndex].tools = category.tools.filter((_: any, i: number) => i !== toolIndex)
                          setFormData(prev => ({ ...prev, categories: updatedCategories }))
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderContactEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Get In Touch"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Brief message about contacting you..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="City, Country"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['github', 'linkedin', 'twitter'].map((platform) => (
            <div key={platform} className="space-y-2">
              <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
              <Input
                id={platform}
                value={formData.socialLinks?.[platform] || ''}
                onChange={(e) => updateField('socialLinks', {
                  ...formData.socialLinks,
                  [platform]: e.target.value
                })}
                placeholder={`Your ${platform} URL`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderFooterEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="copyrightText">Copyright Text</Label>
        <Input
          id="copyrightText"
          value={formData.copyrightText || ''}
          onChange={(e) => updateField('copyrightText', e.target.value)}
          placeholder="© 2024 Your Name. All rights reserved."
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Footer Links</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('links', { name: '', url: '' })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.links || []).map((link: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={link.name}
                onChange={(e) => updateArrayItem('links', index, {
                  ...link,
                  name: e.target.value
                })}
                placeholder="Link name"
              />
              <Input
                value={link.url}
                onChange={(e) => updateArrayItem('links', index, {
                  ...link,
                  url: e.target.value
                })}
                placeholder="Link URL"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeArrayItem('links', index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderEditor = () => {
    switch (section) {
      case 'hero':
        return renderHeroEditor()
      case 'about':
        return renderAboutEditor()
      case 'tools':
        return renderToolsEditor()
      case 'contact':
        return renderContactEditor()
      case 'footer':
        return renderFooterEditor()
      default:
        return <div>Unknown section type</div>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderEditor()}
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}