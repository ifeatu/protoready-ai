'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus,
  FileText,
  Shield,
  Zap,
  Users,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

interface AssessmentReport {
  id: string
  project_name: string
  tool_type: string
  report_type: string
  overall_score: number
  security_rating: string
  deployment_readiness: string
  created_at: string
}

export default function DashboardPage() {
  const [reports, setReports] = useState<AssessmentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAssessments: 0,
    averageScore: 0,
    readyForProduction: 0,
    criticalIssues: 0
  })

  useEffect(() => {
    // Mock data for demonstration
    const mockReports: AssessmentReport[] = [
      {
        id: '1',
        project_name: 'E-commerce Dashboard',
        tool_type: 'lovable',
        report_type: 'professional',
        overall_score: 87,
        security_rating: 'medium',
        deployment_readiness: 'ready',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        project_name: 'Chat Application',
        tool_type: 'replit',
        report_type: 'basic',
        overall_score: 72,
        security_rating: 'high',
        deployment_readiness: 'needs-work',
        created_at: '2024-01-12T14:22:00Z'
      },
      {
        id: '3',
        project_name: 'Portfolio Website',
        tool_type: 'bolt',
        report_type: 'free',
        overall_score: 94,
        security_rating: 'low',
        deployment_readiness: 'ready',
        created_at: '2024-01-10T09:15:00Z'
      }
    ]

    setTimeout(() => {
      setReports(mockReports)
      setStats({
        totalAssessments: mockReports.length,
        averageScore: Math.round(mockReports.reduce((sum, r) => sum + r.overall_score, 0) / mockReports.length),
        readyForProduction: mockReports.filter(r => r.deployment_readiness === 'ready').length,
        criticalIssues: mockReports.filter(r => r.security_rating === 'critical').length
      })
      setLoading(false)
    }, 1000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'ready': return 'text-green-600'
      case 'needs-work': return 'text-yellow-600'
      case 'not-ready': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getReadinessIcon = (readiness: string) => {
    switch (readiness) {
      case 'ready': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'needs-work': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'not-ready': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link href="/assessment">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Monitor your application assessments and track production readiness</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                      {stats.averageScore}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Production Ready</p>
                    <p className="text-2xl font-bold text-green-600">{stats.readyForProduction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                    <p className="text-2xl font-bold text-red-600">{stats.criticalIssues}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>
                    Your latest production readiness assessments
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/assessment">
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                  <p className="text-gray-600 mb-4">Get started by running your first assessment</p>
                  <Button asChild>
                    <Link href="/assessment">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Assessment
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{report.project_name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {report.tool_type}
                                </Badge>
                                <Badge 
                                  variant={report.report_type === 'professional' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {report.report_type}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(report.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(report.overall_score)}`}>
                              {report.overall_score}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              {getReadinessIcon(report.deployment_readiness)}
                            </div>
                            <div className={`text-xs font-medium ${getReadinessColor(report.deployment_readiness)}`}>
                              {report.deployment_readiness.replace('-', ' ')}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {report.overall_score < 80 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm text-gray-600">Improvements recommended</span>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href="/marketplace">
                                <Users className="h-4 w-4 mr-1" />
                                Find Consultant
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Security Assessment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Run a comprehensive security analysis of your application
                </p>
                <Button className="w-full" asChild>
                  <Link href="/assessment">Start Security Scan</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Performance Review</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Identify bottlenecks and optimization opportunities
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/assessment">Analyze Performance</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Expert Consultants</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with vetted developers for implementation support
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/marketplace">Browse Consultants</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}