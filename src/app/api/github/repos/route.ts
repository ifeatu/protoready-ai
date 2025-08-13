import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createGitHubService } from '@/lib/github'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken || session.provider !== 'github') {
      return NextResponse.json(
        { error: 'GitHub authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort') as 'created' | 'updated' | 'pushed' | 'full_name' || 'updated'
    const direction = searchParams.get('direction') as 'asc' | 'desc' || 'desc'
    const per_page = Math.min(parseInt(searchParams.get('per_page') || '30'), 100)
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)

    const githubService = createGitHubService(session.accessToken)
    const repos = await githubService.getUserRepos({
      sort,
      direction,
      per_page,
      page
    })

    return NextResponse.json({
      repos,
      pagination: {
        page,
        per_page,
        sort,
        direction
      }
    })
  } catch (error: any) {
    console.error('GitHub repos API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories', details: error.message },
      { status: 500 }
    )
  }
}