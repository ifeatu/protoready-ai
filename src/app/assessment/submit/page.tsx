'use client'

import { useState } from 'react'
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
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [error, setError] = useState('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/assessment" className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Wizard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Tool Selection */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-2">Select Your Development Tool</h2>
              <p className="text-gray-600 mb-6">Choose the tool you used to build your application</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Lovable', 'Replit', 'Bolt/Claude', 'GitHub Repository'].map((tool) => (
                  <div
                    key={tool}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedTool(tool.toLowerCase())
                      setStep(2)
                    }}
                  >
                    <h3 className="font-semibold">{tool}</h3>
                    <p className="text-sm text-gray-600">Click to select this tool</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Instructions */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-2">Analysis Instructions</h2>
              <p className="text-gray-600 mb-6">Follow these instructions to generate the required analysis data</p>
              
              {selectedTool === 'lovable' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium mb-3">Run this command in your project directory:</p>
                  <div className="bg-black p-3 rounded text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{`echo "=== PROTOREADY ANALYSIS START ===" && \\
echo "=== PROJECT STRUCTURE ===" && \\
find . -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) | head -30 && \\
echo "=== PACKAGE DEPENDENCIES ===" && \\
cat package.json | grep -A 50 '"dependencies"' && \\
echo "=== BUILD CONFIGURATION ===" && \\
ls -la | grep -E "(webpack|vite|next|build)" && \\
echo "=== SECURITY SCAN ===" && \\
grep -r "API_KEY\\|SECRET\\|PASSWORD\\|console\\.log" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | head -10 && \\
echo "=== DATABASE USAGE ===" && \\
grep -r "mongodb\\|postgresql\\|mysql\\|firebase\\|supabase" . --include="*.js" --include="*.ts" | head -5 && \\
echo "=== STATE MANAGEMENT ===" && \\
grep -r "useState\\|useEffect\\|redux\\|zustand\\|context" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== ERROR HANDLING ===" && \\
grep -r "try\\|catch\\|throw\\|Error" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== PERFORMANCE PATTERNS ===" && \\
grep -r "useMemo\\|useCallback\\|React\\.memo\\|lazy" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== PROTOREADY ANALYSIS END ==="`}</pre>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Copy the entire output and paste it in the next step.</p>
                </div>
              )}
              
              {selectedTool !== 'lovable' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-mono">
                    Please follow the specific instructions for {selectedTool} to generate your project analysis output.
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  I've Generated the Output
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Choose Different Tool
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Form */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-2">Project Information</h2>
              <p className="text-gray-600 mb-6">Provide details about your project and paste the analysis output</p>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="My Awesome App"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <select 
                      value={formData.projectType} 
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select project type</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="api">API/Backend Service</option>
                      <option value="desktop">Desktop Application</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description (Optional)</label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of what your application does..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Output *</label>
                  <textarea
                    value={formData.codeOutput}
                    onChange={(e) => setFormData({...formData, codeOutput: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    placeholder="Paste the complete output from the analysis commands here..."
                    rows={10}
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Paste the complete output from the commands provided in the previous step
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select 
                    value={formData.reportType} 
                    onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="free">Free Assessment</option>
                    <option value="basic">Basic Report ($29)</option>
                    <option value="professional">Professional Report ($99)</option>
                  </select>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
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
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back to Instructions
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && analysisResult && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold">Analysis Complete</h2>
                </div>
                <p className="text-gray-600 mb-6">Your production readiness assessment is ready</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(analysisResult.assessment?.overallScore || 0)}`}>
                      {analysisResult.assessment?.overallScore || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {analysisResult.assessment?.deploymentReadiness || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-600">Deployment Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResult.assessment?.scalabilityIndex || 'N/A'}/5
                    </div>
                    <div className="text-sm text-gray-600">Scalability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisResult.assessment?.maintainabilityGrade || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Maintainability</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => window.open('/protoready-sample.pdf', '_blank')}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = '/protoready-sample.pdf'
                      link.download = 'protoready-assessment-report.pdf'
                      link.click()
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  <Link 
                    href="/marketplace"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Find Consultant
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}