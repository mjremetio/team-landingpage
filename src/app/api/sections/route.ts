import { NextRequest, NextResponse } from 'next/server'
import { Database, validateSection } from '@/lib/db'
import { APIResponse, Section } from '@/types'

export async function GET() {
  try {
    const sections = await Database.getAllSections()
    
    const response: APIResponse<Record<string, Section>> = {
      success: true,
      data: sections,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication is handled by middleware

    const body = await request.json()
    const { section, content } = body

    if (!section || !content) {
      return NextResponse.json(
        { success: false, error: 'Section and content are required' },
        { status: 400 }
      )
    }

    const validSectionTypes = ['hero', 'about', 'tools', 'contact', 'footer']
    if (!validSectionTypes.includes(section)) {
      return NextResponse.json(
        { success: false, error: 'Invalid section type' },
        { status: 400 }
      )
    }

    if (!validateSection(section, content)) {
      return NextResponse.json(
        { success: false, error: 'Invalid section content' },
        { status: 400 }
      )
    }

    const updatedSection = await Database.updateSection(section, content)
    
    const response: APIResponse<Section> = {
      success: true,
      data: updatedSection,
      message: 'Section updated successfully',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update section' },
      { status: 500 }
    )
  }
}