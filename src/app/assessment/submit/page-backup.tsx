'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { getAllToolPrompts, getPromptInstructions } from '@/lib/assessment/prompts'

export default function AssessmentSubmitPage() {
  const [step, setStep] = useState(1)
  const [selectedTool, setSelectedTool] = useState('')
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    projectDescription: '',
    codeOutput: '',
    reportType: 'free'
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    assessment: {
      overallScore: number
      deploymentReadiness: string
      scalabilityIndex: number
      maintainabilityGrade: string
      complianceAssessment?: {
        overallCompliance: number
        regulatoryScores: {
          hipaa: number
          gdpr: number
          ccpa: number
          pci: number
        }
        violations: Array<{
          regulation: string
          severity: 'critical' | 'high' | 'medium' | 'low'
          category: string
          description: string
          remediation: string
        }>
      }
    }
    report: {
      summary: string
      hasPdf: boolean
    }
  } | null>(null)
  const [error, setError] = useState('')

  const toolPrompts = getAllToolPrompts()

  const handleToolSelect = (toolType: string) => {
    setSelectedTool(toolType)
    setStep(2)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.codeOutput.trim()) {
      setError('Please provide the code analysis output')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: selectedTool,
          ...formData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Assessment failed')
      }

      setAnalysisResult(result)
      setStep(4)
      
    } catch (err) {
      setError((err as Error).message || 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

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

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSeverityColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/assessment">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Wizard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <Progress value={(step / 4) * 100} className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Tool Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Your Development Tool</CardTitle>
                <CardDescription>
                  Choose the tool you used to build your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {toolPrompts.map((tool) => (
                    <Card 
                      key={tool.toolType}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleToolSelect(tool.toolType)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <Badge variant="secondary">
                            {tool.toolType === 'lovable' ? 'Popular' : 
                             tool.toolType === 'github' ? 'Advanced' : 'Supported'}
                          </Badge>
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Instructions */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Instructions</CardTitle>
                <CardDescription>
                  Follow these instructions to generate the required analysis data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div 
                    className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: getPromptInstructions(selectedTool)
                        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(3)}>
                    I&apos;ve Generated the Output
                  </Button>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Choose Different Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Form */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Provide details about your project and paste the analysis output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={formData.projectName}
                        onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                        placeholder="My Awesome App"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select 
                        value={formData.projectType} 
                        onValueChange={(value) => setFormData({...formData, projectType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-app">Web Application</SelectItem>
                          <SelectItem value="mobile-app">Mobile Application</SelectItem>
                          <SelectItem value="api">API/Backend Service</SelectItem>
                          <SelectItem value="desktop">Desktop Application</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="projectDescription">Project Description (Optional)</Label>
                    <Textarea
                      id="projectDescription"
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                      placeholder="Brief description of what your application does..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="codeOutput">Analysis Output *</Label>
                    <Textarea
                      id="codeOutput"
                      value={formData.codeOutput}
                      onChange={(e) => setFormData({...formData, codeOutput: e.target.value})}
                      placeholder="Paste the complete output from the analysis commands here..."
                      rows={10}
                      className="font-mono text-sm"
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Paste the complete output from the commands provided in the previous step
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select 
                      value={formData.reportType} 
                      onValueChange={(value) => setFormData({...formData, reportType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free Assessment</SelectItem>
                        <SelectItem value="basic">Basic Report ($29)</SelectItem>
                        <SelectItem value="professional">Professional Report ($99)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back to Instructions
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Results */}
          {step === 4 && analysisResult && (
            <div className="space-y-6">
              {/* Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Analysis Complete
                  </CardTitle>
                  <CardDescription>
                    Your production readiness assessment is ready
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResult.assessment.overallScore)}`}>
                        {analysisResult.assessment.overallScore}
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getReadinessColor(analysisResult.assessment.deploymentReadiness)}`}>
                        {analysisResult.assessment.deploymentReadiness.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">Deployment Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.assessment.scalabilityIndex}/5
                      </div>
                      <div className="text-sm text-gray-600">Scalability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analysisResult.assessment.maintainabilityGrade}
                      </div>
                      <div className="text-sm text-gray-600">Maintainability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Compliance Section */}
              {analysisResult.assessment.complianceAssessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🛡️ Regulatory Compliance Assessment
                    </CardTitle>
                    <CardDescription>
                      HIPAA, GDPR, CCPA, and PCI compliance analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Overall Compliance Score */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getComplianceColor(analysisResult.assessment.complianceAssessment.overallCompliance)}`}>
                          {analysisResult.assessment.complianceAssessment.overallCompliance}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Compliance Score</div>
                      </div>

                      {/* Regulatory Scores */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-xl font-semibold ${getComplianceColor(analysisResult.assessment.complianceAssessment.regulatoryScores.hipaa)}`}>
                            {analysisResult.assessment.complianceAssessment.regulatoryScores.hipaa}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">HIPAA</div>
                          <div className="text-xs text-gray-500">Health Data</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-xl font-semibold ${getComplianceColor(analysisResult.assessment.complianceAssessment.regulatoryScores.gdpr)}`}>
                            {analysisResult.assessment.complianceAssessment.regulatoryScores.gdpr}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">GDPR</div>
                          <div className="text-xs text-gray-500">EU Privacy</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-xl font-semibold ${getComplianceColor(analysisResult.assessment.complianceAssessment.regulatoryScores.ccpa)}`}>
                            {analysisResult.assessment.complianceAssessment.regulatoryScores.ccpa}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">CCPA</div>
                          <div className="text-xs text-gray-500">California Privacy</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-xl font-semibold ${getComplianceColor(analysisResult.assessment.complianceAssessment.regulatoryScores.pci)}`}>
                            {analysisResult.assessment.complianceAssessment.regulatoryScores.pci}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">PCI DSS</div>
                          <div className="text-xs text-gray-500">Payment Security</div>
                        </div>
                      </div>

                      {/* Compliance Violations */}
                      {analysisResult.assessment.complianceAssessment.violations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-gray-800">Compliance Issues Found</h4>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {analysisResult.assessment.complianceAssessment.violations.slice(0, 5).map((violation, index) => (
                              <div key={index} className="p-3 border rounded-lg bg-white">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className={getSeverityColor(violation.severity)}>
                                        {violation.severity.toUpperCase()}
                                      </Badge>
                                      <span className="text-sm font-medium text-blue-600">
                                        {violation.regulation}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {violation.category}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      {violation.description}
                                    </p>
                                    <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                      <strong>Remediation:</strong> {violation.remediation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {analysisResult.assessment.complianceAssessment.violations.length > 5 && (
                              <div className="text-center text-sm text-gray-600 p-2">
                                +{analysisResult.assessment.complianceAssessment.violations.length - 5} more issues in detailed report
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Report Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Report</CardTitle>
                  <CardDescription>
                    Access your detailed production readiness assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button className="flex items-center gap-2" onClick={() => window.open('/protoready-sample.pdf', '_blank')}>
                      <Eye className="h-4 w-4" />
                      View Report
                    </Button>
                    {analysisResult.report.hasPdf && (
                      <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                        const link = document.createElement('a')
                        link.href = '/protoready-sample.pdf'
                        link.download = 'protoready-assessment-report.pdf'
                        link.click()
                      }}>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                    <Button variant="outline" asChild>
                      <Link href="/marketplace">
                        Find Consultant
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Quick Summary:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {analysisResult.report.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.assessment.deploymentReadiness === 'ready' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Your app is ready for production deployment!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Address the identified issues before deploying to production</span>
                      </div>
                    )}
                    
                    <div className="flex gap-4 mt-4">
                      <Button asChild>
                        <Link href="/assessment">New Assessment</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}