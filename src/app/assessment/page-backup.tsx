'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    // Navigate to the tool-specific assessment form
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
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
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
              Get a comprehensive analysis of your AI-built application. We&apos;ll evaluate security, 
              scalability, performance, and provide a detailed roadmap to production.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security Analysis</h3>
                <p className="text-sm text-gray-600">OWASP compliance, vulnerability scanning, and data protection audit</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Performance Review</h3>
                <p className="text-sm text-gray-600">Load testing, optimization opportunities, and scalability assessment</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Expert Guidance</h3>
                <p className="text-sm text-gray-600">Connect with vetted consultants for implementation support</p>
              </CardContent>
            </Card>
          </div>

          {/* Tool Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Choose Your Development Tool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {toolPrompts.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          {tool.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{tool.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{tool.prompt}</p>
                    <Button 
                      className="w-full"
                      onClick={() => handleToolSelect(tool.name)}
                    >
                      Select {tool.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What You'll Get */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-xl">What You&apos;ll Receive</CardTitle>
              <CardDescription>
                Comprehensive analysis report with actionable recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              Ready to get started? Choose your tool above or upload a GitHub repository.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/assessment/submit">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Free Assessment
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('/protoready-sample.pdf', '_blank')}>
                View Sample Report
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}