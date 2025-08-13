import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createGoogleService } from '@/lib/google'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken || session.provider !== 'google') {
      return NextResponse.json(
        { error: 'Google authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100)
    const pageToken = searchParams.get('pageToken') || undefined
    const query = searchParams.get('q') || 'trashed=false'
    const orderBy = searchParams.get('orderBy') || 'modifiedTime desc'

    const googleService = createGoogleService(session.accessToken)
    const result = await googleService.listDriveFiles({
      pageSize,
      pageToken,
      q: query,
      orderBy
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Google Drive API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Google Drive files', details: error.message },
      { status: 500 }
    )
  }
}