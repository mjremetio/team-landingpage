/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { ProjectFormData } from '@/types'

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: ProjectFormData) => {
    setIsLoading(true)
    
    try {
      // First upload images if any
      let imageUrls: string[] = []
      
      if (formData.images.length > 0) {
        const uploadData = new FormData()
        formData.images.forEach((file) => {
          uploadData.append('files', file)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        const uploadResult = await uploadResponse.json()
        
        if (uploadResult.success) {
          imageUrls = uploadResult.data.files.map((file: any) => file.url)
        } else {
          throw new Error('Failed to upload images')
        }
      }

      // Create project with uploaded image URLs
      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        images: imageUrls,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        category: formData.category,
        featured: formData.featured,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()

      if (result.success) {
        router.push('/admin/projects')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground">
          Add a new project to your portfolio
        </p>
      </div>

      <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}