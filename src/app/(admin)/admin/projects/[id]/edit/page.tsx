/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { Project, ProjectFormData } from '@/types'

interface EditProjectPageProps {
  params: { id: string }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setProject(result.data)
      } else {
        alert('Project not found')
        router.push('/admin/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Failed to load project')
      router.push('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: ProjectFormData) => {
    setIsSubmitting(true)
    
    try {
      // Upload new images if any
      let newImageUrls: string[] = []
      
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
          newImageUrls = uploadResult.data.files.map((file: any) => file.url)
        } else {
          throw new Error('Failed to upload new images')
        }
      }

      // Combine existing images with new ones
      const allImages = [...(project?.images || []), ...newImageUrls]

      // Update project
      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        images: allImages,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        category: formData.category,
        featured: formData.featured,
      }

      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
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
        alert(result.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/4 mt-2 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Project Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The project you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">
          Update your project details and information
        </p>
      </div>

      <ProjectForm 
        project={project} 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  )
}