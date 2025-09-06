import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions, isAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/gif',
        'application/pdf',
        'text/plain',
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File type ${file.type} not allowed` },
          { status: 400 }
        )
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} exceeds size limit of 10MB` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`

      try {
        const blob = await put(filename, file, {
          access: 'public',
        })

        uploadedFiles.push({
          url: blob.url,
          pathname: blob.pathname,
          size: file.size,
          type: file.type,
          originalName: file.name,
        })
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError)
        return NextResponse.json(
          { success: false, error: `Failed to upload ${file.name}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: { files: uploadedFiles },
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    })
  } catch (error) {
    console.error('Error in file upload:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}