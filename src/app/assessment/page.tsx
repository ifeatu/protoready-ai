'use client'

import { 
  Code2, 
  Upload, 
  FileText, 
  Shield,
  Zap,
  Users,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AssessmentPage() {
  const router = useRouter()

  const handleToolSelect = (toolName: string) => {
    router.push(`/assessment/submit?tool=${toolName.toLowerCase()}`)
  }

  const toolPrompts = [
    {
      name: 'Lovable',
      icon: <Code2 className="h-6 w-6" />,
      description: 'For React/Next.js apps built with Lovable',
      badge: 'Most Popular',
      prompt: 'Run this in your terminal and paste the output:'
    },
    {
      name: 'Replit',
      icon: <Code2 className="h-6 w-6" />,
      description: 'For Python/JavaScript apps in Replit',
      badge: 'Easy Setup',
      prompt: 'Run this in your Replit console:'
    },
    {
      name: 'Bolt/Claude',
      icon: <Code2 className="h-6 w-6" />,
      description: 'For apps built with Bolt or Claude Artifacts',
      badge: 'New',
      prompt: 'Generate project structure with this command:'
    },
    {
      name: 'GitHub Repository',
      icon: <Upload className="h-6 w-6" />,
      description: 'Upload from any GitHub repository',
      badge: 'Advanced',
      prompt: 'Connect your GitHub repository'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
          <Link href="/" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Production Readiness Assessment
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive analysis of your AI-built application. We'll evaluate security, 
              scalability, performance, and provide a detailed roadmap to production.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
              <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Security Analysis</h3>
              <p className="text-sm text-gray-600">OWASP compliance, vulnerability scanning, and data protection audit</p>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
              <Zap className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Performance Review</h3>
              <p className="text-sm text-gray-600">Load testing, optimization opportunities, and scalability assessment</p>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-gray-600">Connect with vetted consultants for implementation support</p>
            </div>
          </div>

          {/* Tool Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Choose Your Development Tool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {toolPrompts.map((tool, index) => (
                <div key={index} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{tool.name}</h3>
                        <p className="text-gray-600 text-sm">{tool.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{tool.badge}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tool.prompt}</p>
                  <button 
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => handleToolSelect(tool.name)}
                  >
                    Select {tool.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Get */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-12">
            <h2 className="text-xl font-semibold mb-2">What You'll Receive</h2>
            <p className="text-gray-600 mb-6">Comprehensive analysis report with actionable recommendations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Free Assessment Includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Overall readiness score (0-100)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Security risk rating</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Scalability assessment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">High-level recommendations</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Paid Reports Include:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">Detailed technical analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">Step-by-step remediation roadmap</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">Cost estimates and timelines</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm">SOC 2 compliance preparation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              Ready to get started? Choose your tool above or upload a GitHub repository.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/assessment/submit"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Start Free Assessment
              </Link>
              <button 
                onClick={() => window.open('/protoready-sample.pdf', '_blank')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Sample Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}