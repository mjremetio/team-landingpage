'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Upload, Image as ImageIcon, ExternalLink, Github } from 'lucide-react'
import { Project, ProjectFormData } from '@/types'

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: ProjectFormData) => Promise<void>
  isLoading?: boolean
}

export function ProjectForm({ project, onSubmit, isLoading = false }: ProjectFormProps) {
  const router = useRouter()
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || [])
  const [techInput, setTechInput] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(project?.images || [])
  const [dragActive, setDragActive] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Omit<ProjectFormData, 'technologies' | 'images'>>({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      liveUrl: project?.liveUrl || '',
      githubUrl: project?.githubUrl || '',
      category: project?.category || '',
      featured: project?.featured || false,
    },
  })

  const category = watch('category')
  const featured = watch('featured')

  const categories = [
    'Web Development',
    'Mobile Apps',
    'Desktop Apps',
    'UI/UX Design',
    'Backend APIs',
    'Machine Learning',
    'Other'
  ]

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      const tech = techInput.trim()
      if (!technologies.includes(tech)) {
        setTechnologies([...technologies, tech])
      }
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
    setImages(prev => [...prev, ...imageFiles])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const onFormSubmit = async (data: Omit<ProjectFormData, 'technologies' | 'images'>) => {
    const formData: ProjectFormData = {
      ...data,
      technologies,
      images,
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide the essential details about your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="My Awesome Project"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe your project, what it does, and what makes it special..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Featured projects appear prominently on the homepage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
          <CardDescription>
            Add the technologies and tools used in this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="technologies">Add Technologies</Label>
            <Input
              id="technologies"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTechnology}
              placeholder="Type a technology and press Enter (e.g., React, Node.js, PostgreSQL)"
            />
          </div>
          
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Project Links</CardTitle>
          <CardDescription>
            Add links to live demo and source code (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="liveUrl">
              <ExternalLink className="w-4 h-4 inline mr-1" />
              Live Demo URL
            </Label>
            <Input
              id="liveUrl"
              {...register('liveUrl')}
              placeholder="https://myproject.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">
              <Github className="w-4 h-4 inline mr-1" />
              GitHub Repository
            </Label>
            <Input
              id="githubUrl"
              {...register('githubUrl')}
              placeholder="https://github.com/username/repository"
              type="url"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Project Images</CardTitle>
          <CardDescription>
            Upload screenshots, mockups, or other visual assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Current Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drop images here or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">PNG, JPG, WebP up to 10MB each</p>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload">
              <Button type="button" variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Images
                </span>
              </Button>
            </Label>
          </div>

          {/* New Images Preview */}
          {images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">New Images ({images.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}