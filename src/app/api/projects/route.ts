import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'
import { Database, validateProject } from '@/lib/db'
import { APIResponse, PaginatedResponse, Project } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined
    const search = searchParams.get('search') || undefined

    const { projects, total } = await Database.getAllProjects({
      page,
      limit,
      category,
      featured,
      search,
    })

    const response: PaginatedResponse<Project> = {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!validateProject(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project data' },
        { status: 400 }
      )
    }

    const project = await Database.createProject(body)
    
    const response: APIResponse<Project> = {
      success: true,
      data: project,
      message: 'Project created successfully',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}