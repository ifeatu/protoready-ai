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

    const googleService = createGoogleService(session.accessToken)
    const analysis = await googleService.analyzeUserActivity()

    // Generate organization and compliance insights
    const organizationScore = calculateOrganizationScore(analysis)

    return NextResponse.json({
      ...analysis,
      organizationScore,
      analysisTimestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Google analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze Google Drive', details: error.message },
      { status: 500 }
    )
  }
}

function calculateOrganizationScore(analysis: any): {
  overall: number
  fileOrganization: number
  activityLevel: number
  storageManagement: number
  recommendations: string[]
} {
  const recommendations: string[] = []
  let fileOrganizationScore = 40
  let activityScore = 30
  let storageScore = 50

  const { totalFiles, recentFiles, storageUsed, fileTypes } = analysis

  // File organization analysis
  const folderCount = fileTypes['application/vnd.google-apps.folder'] || 0
  const folderRatio = totalFiles > 0 ? folderCount / totalFiles : 0

  if (folderRatio > 0.1) {
    fileOrganizationScore += 30
  } else if (folderRatio > 0.05) {
    fileOrganizationScore += 15
  } else {
    recommendations.push('Create more folders to organize your files better')
  }

  // Check for Google Workspace documents
  const googleDocsCount = (fileTypes['application/vnd.google-apps.document'] || 0) +
                         (fileTypes['application/vnd.google-apps.spreadsheet'] || 0) +
                         (fileTypes['application/vnd.google-apps.presentation'] || 0)
  
  if (googleDocsCount > totalFiles * 0.3) {
    fileOrganizationScore += 20
  }

  // Activity level analysis
  const recentActivityRatio = totalFiles > 0 ? recentFiles.length / Math.min(totalFiles, 100) : 0
  
  if (recentActivityRatio > 0.2) {
    activityScore += 40
  } else if (recentActivityRatio > 0.1) {
    activityScore += 20
  } else {
    recommendations.push('Consider reviewing and updating your files more regularly')
  }

  // Storage management analysis
  const storageUsedGB = storageUsed / (1024 * 1024 * 1024)
  
  if (storageUsedGB < 5) {
    storageScore += 30
  } else if (storageUsedGB < 10) {
    storageScore += 15
  } else if (storageUsedGB > 13) {
    recommendations.push('Consider cleaning up large files or upgrading storage')
    storageScore -= 10
  }

  // Check for duplicate file types that might indicate redundancy
  const imageFiles = Object.entries(fileTypes)
    .filter(([type]) => type.startsWith('image/'))
    .reduce((sum, [, count]) => sum + count, 0)
  
  if (imageFiles > totalFiles * 0.5) {
    recommendations.push('Consider organizing images into albums or folders')
  }

  // Cap scores at 100
  fileOrganizationScore = Math.min(fileOrganizationScore, 100)
  activityScore = Math.min(activityScore, 100)
  storageScore = Math.min(storageScore, 100)

  const overall = Math.round(
    (fileOrganizationScore * 0.4 + activityScore * 0.3 + storageScore * 0.3)
  )

  return {
    overall,
    fileOrganization: fileOrganizationScore,
    activityLevel: activityScore,
    storageManagement: storageScore,
    recommendations
  }
}