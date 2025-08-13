import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      toolType, 
      codeOutput, 
      projectType, 
      projectName = 'Unnamed Project',
      projectDescription,
      reportType = 'free',
      userId 
    } = body

    // Mock assessment response for deployment
    const mockAssessment = {
      id: 'mock-assessment-' + Date.now(),
      projectName,
      toolType,
      projectType,
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      securityScore: Math.floor(Math.random() * 40) + 60,
      performanceScore: Math.floor(Math.random() * 40) + 60,
      scalabilityScore: Math.floor(Math.random() * 40) + 60,
      findings: [
        {
          category: 'security',
          severity: 'medium',
          title: 'Input Validation',
          description: 'Implement proper input validation for all user inputs',
          recommendation: 'Add validation middleware and sanitize all inputs'
        },
        {
          category: 'performance',
          severity: 'low',
          title: 'Database Optimization',
          description: 'Some database queries could be optimized',
          recommendation: 'Add indexing and optimize query structures'
        }
      ],
      complianceAssessment: {
        overallCompliance: 75,
        regulatoryScores: {
          GDPR: 80,
          HIPAA: 70,
          CCPA: 75,
          PCI: 70
        },
        violations: [],
        recommendations: [
          'Implement data encryption at rest',
          'Add audit logging for data access',
          'Create data retention policies'
        ]
      },
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(mockAssessment)
  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Assessment API is running',
    timestamp: new Date().toISOString()
  })
}