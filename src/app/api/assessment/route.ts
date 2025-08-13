import { NextRequest, NextResponse } from 'next/server'
import { assessmentEngine } from '@/lib/assessment/engine'
import { simpleReportGenerator } from '@/lib/report/simple-generator'
import { validateAssessmentInput } from '@/lib/assessment/prompts'
import { supabase } from '@/lib/supabase'

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

    // Validate input
    const validation = validateAssessmentInput({
      toolType,
      codeOutput,
      projectType
    })

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      )
    }

    // Check rate limits for free tier
    if (userId && reportType === 'free' && supabase) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('assessments_used_this_month, assessments_limit')
        .eq('user_id', userId)
        .single()

      if (subscription && subscription.assessments_used_this_month >= subscription.assessments_limit) {
        return NextResponse.json(
          { error: 'Assessment limit reached', message: 'Upgrade to continue' },
          { status: 429 }
        )
      }
    }

    // Run assessment
    const assessmentResult = await assessmentEngine.analyzeCode({
      toolType,
      codeOutput,
      projectType,
      projectDescription
    })

    // Generate report
    const reportConfig = {
      reportType: reportType as 'free' | 'basic' | 'professional',
      projectName,
      companyName: 'ProtoReady.ai'
    }

    const reportHtml = simpleReportGenerator.generateHTMLReport(assessmentResult, reportConfig)
    const reportSummary = simpleReportGenerator.generateSummary(assessmentResult)

    // Save to database if user is authenticated
    if (userId && supabase) {
      const { error: dbError } = await supabase
        .from('assessment_reports')
        .insert({
          user_id: userId,
          project_name: projectName,
          tool_type: toolType,
          report_type: reportType,
          overall_score: assessmentResult.overallScore,
          security_rating: assessmentResult.securityRating,
          scalability_index: assessmentResult.scalabilityIndex,
          maintainability_grade: assessmentResult.maintainabilityGrade,
          deployment_readiness: assessmentResult.deploymentReadiness,
          detailed_findings: assessmentResult.detailedFindings,
          remediation_roadmap: assessmentResult.remediationRoadmap,
          compliance_assessment: assessmentResult.complianceAssessment || null,
          raw_assessment_data: {
            toolType,
            projectType,
            projectDescription,
            codeOutput: codeOutput.substring(0, 1000) // Store truncated version
          },
          estimated_cost_min: assessmentResult.estimatedCost?.min,
          estimated_cost_max: assessmentResult.estimatedCost?.max
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Continue anyway - don't fail the assessment
      }

      // Update usage count
      await supabase.rpc('increment_assessment_usage', { user_id: userId })
    }

    return NextResponse.json({
      success: true,
      assessment: assessmentResult,
      report: {
        html: reportHtml,
        summary: reportSummary,
        hasPdf: false
      }
    })

  } catch (error) {
    console.error('Assessment error:', error)
    return NextResponse.json(
      { error: 'Assessment failed', message: 'Please try again' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    )
  }

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  try {
    const { data: reports, error } = await supabase
      .from('assessment_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      reports
    })

  } catch (error) {
    console.error('Fetch reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}