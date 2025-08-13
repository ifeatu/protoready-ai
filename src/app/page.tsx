import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Clock
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/assessment" className="text-gray-600 hover:text-gray-900">
              Assessment
            </Link>
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
              Consultants
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Bridge the Gap: Prototype → Production
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your <span className="text-indigo-600">AI-Built Apps</span> 
            <br />
            Into Production-Ready Systems
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get comprehensive assessments of apps built with Lovable, Replit, Bolt, and other AI tools. 
            Connect with expert developers to bridge the final gap to production.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/assessment">
                Start Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">Browse Consultants</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">2 mins</span>
              </div>
              <p className="text-gray-600">Average assessment time</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">87%</span>
              </div>
              <p className="text-gray-600">Average readiness improvement</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold">50+</span>
              </div>
              <p className="text-gray-600">Expert consultants available</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Production Readiness
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive analysis and expert guidance to transform your prototype into a scalable, secure application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Security Assessment</CardTitle>
              <CardDescription>
                Comprehensive security analysis including vulnerability scanning and compliance checks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">OWASP security scan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Data protection audit</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">SOC 2 readiness</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Identify bottlenecks and optimization opportunities for scale.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Load testing simulation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Database optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Caching strategies</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Expert Consultants</CardTitle>
              <CardDescription>
                Connect with vetted developers specialized in production deployment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">5+ years experience</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Specialized expertise</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Proven track record</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-lg mx-4 my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start free, scale as you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>• Basic readiness score</li>
                <li>• 3 assessments per month</li>
                <li>• High-level recommendations</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/assessment">Start Free</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 border-2">
            <CardHeader>
              <Badge className="w-fit mb-2">Most Popular</Badge>
              <CardTitle>Basic</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>• Detailed technical reports</li>
                <li>• Unlimited assessments</li>
                <li>• Remediation roadmaps</li>
                <li>• Priority support</li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>• Enterprise compliance analysis</li>
                <li>• Consultant matching</li>
                <li>• Implementation guidance</li>
                <li>• SOC 2/ISO 27001 prep</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/auth">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make Your App Production-Ready?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of developers who have successfully deployed their AI-built applications to production.
          </p>
          <Button size="lg" asChild>
            <Link href="/assessment">
              Start Your Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">ProtoReady.ai</span>
              </div>
              <p className="text-gray-400">
                Bridging the gap between prototype velocity and enterprise reliability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/assessment">Assessment</Link></li>
                <li><Link href="/marketplace">Consultants</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/status">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProtoReady.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
