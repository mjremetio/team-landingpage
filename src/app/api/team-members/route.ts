import { NextResponse } from 'next/server'
import { Database } from '@/lib/db'
import { APIResponse, TeamMember } from '@/types'

export async function GET() {
  try {
    const teamMembers = await Database.getAllTeamMembers({ activeOnly: true })
    
    const response: APIResponse<TeamMember[]> = {
      success: true,
      data: teamMembers,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const newMember = await Database.createTeamMember(data)
    
    const response: APIResponse<TeamMember> = {
      success: true,
      data: newMember,
      message: 'Team member created successfully',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}