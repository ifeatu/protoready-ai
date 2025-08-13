import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createGitHubService } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken || session.provider !== 'github') {
      return NextResponse.json(
        { error: 'GitHub authentication required' },
        { status: 401 }
      )
    }

    const { owner, repo } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repository name are required' },
        { status: 400 }
      )
    }

    const githubService = createGitHubService(session.accessToken)
    const analysis = await githubService.analyzeRepository(owner, repo)

    // Generate regulatory readiness score based on repository analysis
    const readinessScore = calculateReadinessScore(analysis)

    return NextResponse.json({
      ...analysis,
      readinessScore,
      analysisTimestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('GitHub analysis API error:', error)
    
    if (error.status === 404) {
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze repository', details: error.message },
      { status: 500 }
    )
  }
}

function calculateReadinessScore(analysis: any): {
  overall: number
  security: number
  documentation: number
  maintenance: number
  compliance: number
  recommendations: string[]
} {
  const recommendations: string[] = []
  let securityScore = 50
  let documentationScore = 30
  let maintenanceScore = 40
  let complianceScore = 25

  // Security analysis
  if (analysis.repository.has_security_policy) {
    securityScore += 20
  } else {
    recommendations.push('Add a SECURITY.md file with security policy')
  }

  if (analysis.repository.security_and_analysis?.secret_scanning?.status === 'enabled') {
    securityScore += 15
  } else {
    recommendations.push('Enable secret scanning in repository settings')
  }

  // Documentation analysis
  if (analysis.readme) {
    documentationScore += 30
    if (analysis.readme.content.length > 1000) {
      documentationScore += 20
    }
  } else {
    recommendations.push('Add a comprehensive README.md file')
  }

  if (analysis.repository.has_wiki) {
    documentationScore += 10
  }

  // Maintenance analysis
  if (analysis.recentActivity.commits > 5) {
    maintenanceScore += 30
  } else if (analysis.recentActivity.commits > 0) {
    maintenanceScore += 15
  } else {
    recommendations.push('Repository appears inactive - consider regular maintenance')
  }

  if (analysis.repository.open_issues_count < 10) {
    maintenanceScore += 20
  } else {
    recommendations.push('Consider addressing open issues to improve maintenance score')
  }

  // Compliance analysis
  if (analysis.repository.license?.spdx_id) {
    complianceScore += 25
  } else {
    recommendations.push('Add an appropriate open source license')
  }

  const languageKeys = Object.keys(analysis.languages)
  if (languageKeys.includes('TypeScript') || languageKeys.includes('JavaScript')) {
    complianceScore += 15
    if (languageKeys.includes('TypeScript')) {
      complianceScore += 10
    }
  }

  // Cap scores at 100
  securityScore = Math.min(securityScore, 100)
  documentationScore = Math.min(documentationScore, 100)
  maintenanceScore = Math.min(maintenanceScore, 100)
  complianceScore = Math.min(complianceScore, 100)

  const overall = Math.round(
    (securityScore * 0.3 + documentationScore * 0.2 + maintenanceScore * 0.3 + complianceScore * 0.2)
  )

  return {
    overall,
    security: securityScore,
    documentation: documentationScore,
    maintenance: maintenanceScore,
    compliance: complianceScore,
    recommendations
  }
}