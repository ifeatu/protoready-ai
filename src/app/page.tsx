import Link from 'next/link'
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Clock,
  Award,
  Target,
  TrendingUp,
  UserPlus,
  Code,
  Rocket
} from 'lucide-react'
import { AuthButton } from '@/components/auth-button'

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
            <Link href="/consultant/apply" className="text-gray-600 hover:text-gray-900">
              For Consultants
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <AuthButton />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            Bridge the Gap: Prototype → Production
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your <span className="text-indigo-600">AI-Built Apps</span> 
            <br />
            Into Production-Ready Systems
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Get comprehensive assessments of apps built with Lovable, Replit, Bolt, and other AI tools. 
            Connect with <span className="font-semibold text-gray-900">expert-vetted consultants</span> to bridge the final gap to production.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <p className="text-sm text-amber-800">
              🔐 <strong>Login required</strong> for assessments to ensure secure, personalized results
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Get Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/consultant/apply" className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors">
              <UserPlus className="mr-2 h-4 w-4" />
              Become a Consultant
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Join 500+ developers who've successfully deployed their AI-built applications
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white text-center rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold">2 mins</span>
            </div>
            <p className="text-gray-600">Average assessment time</p>
          </div>
          <div className="bg-white text-center rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold">87%</span>
            </div>
            <p className="text-gray-600">Average readiness improvement</p>
          </div>
          <div className="bg-white text-center rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold">50+</span>
            </div>
            <p className="text-gray-600">Expert consultants available</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How ProtoReady.ai Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple 3-step process to transform your prototype into a production-ready application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Get Assessment</h3>
            <p className="text-gray-600">
              Sign in and submit your AI-built application for a comprehensive production readiness analysis. 
              Our system evaluates security, performance, and scalability.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Find Expert</h3>
            <p className="text-gray-600">
              Browse our network of vetted consultants specializing in production deployment. 
              Each expert has 5+ years experience and proven track record.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Deploy & Scale</h3>
            <p className="text-gray-600">
              Work with your chosen consultant to implement security fixes, optimize performance, 
              and deploy your application to production infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Consultant Network Section */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Consultant Network
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Work with hand-picked experts who specialize in transforming prototypes into production systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Security Specialists</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    4.9 average rating
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Enterprise security experts specializing in OWASP compliance, SOC 2 readiness, and vulnerability remediation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">SOC 2</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">OWASP</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">Pen Testing</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Performance Engineers</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    4.8 average rating
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Optimization experts who scale applications to handle millions of users with advanced caching and database strategies.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">Load Testing</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">CDN</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">Database</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Full-Stack Architects</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    4.9 average rating
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                System architects who design scalable infrastructure and implement best practices for modern application deployment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">AWS</span>
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">Docker</span>
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">CI/CD</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/consultant/apply" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <Award className="mr-2 h-4 w-4" />
              Join Our Expert Network
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Earn $95-$150/hour helping developers deploy production-ready applications
            </p>
          </div>
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
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6">
              <Shield className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold leading-none mb-1.5">Security Assessment</h3>
              <p className="text-gray-500 text-sm mb-4">
                Comprehensive security analysis including vulnerability scanning and compliance checks.
              </p>
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
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6">
              <Zap className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold leading-none mb-1.5">Performance Analysis</h3>
              <p className="text-gray-500 text-sm mb-4">
                Identify bottlenecks and optimization opportunities for scale.
              </p>
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
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6">
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold leading-none mb-1.5">Expert Consultants</h3>
              <p className="text-gray-500 text-sm mb-4">
                Connect with vetted developers specialized in production deployment.
              </p>
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
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real results from developers who transformed their AI-built prototypes into production systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "ProtoReady helped us identify 23 security vulnerabilities in our Lovable-built SaaS. 
                The consultant we hired fixed everything in 2 weeks. Now we're SOC 2 compliant!"
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">JC</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">James Chen</p>
                  <p className="text-gray-600 text-xs">Founder, TaskFlow AI</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "Our Replit prototype was loading in 8 seconds. After working with a ProtoReady performance engineer, 
                we're down to 1.2 seconds and handling 10x the traffic."
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-sm">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Sarah Miller</p>
                  <p className="text-gray-600 text-xs">CTO, EcoTrack</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4">
                "The assessment score went from 34 to 92 after following the roadmap. 
                Best investment we made - saved months of trial and error."
              </p>
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">DK</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">David Kumar</p>
                  <p className="text-gray-600 text-xs">Lead Developer, FinanceBot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultant Benefits Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Expert Consultants Join ProtoReady.ai
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a curated network of specialists helping transform the future of application development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Premium Rates</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">$95-150/hr</p>
              <p className="text-gray-600 text-sm">
                Higher rates than typical freelance platforms
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Clients</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">Pre-Vetted</p>
              <p className="text-gray-600 text-sm">
                Work with serious developers ready to invest in quality
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Focused Work</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">Specialized</p>
              <p className="text-gray-600 text-sm">
                Projects match your exact expertise and interests
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Recognition</h3>
              <p className="text-2xl font-bold text-yellow-600 mb-2">Expert Status</p>
              <p className="text-gray-600 text-sm">
                Build reputation in the growing AI-to-production space
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/consultant/apply" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
              <UserPlus className="mr-2 h-5 w-5" />
              Apply to Join Network
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              Application review typically takes 3-5 business days
            </p>
          </div>
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
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold leading-none mb-1.5">Free</h3>
              <div className="text-gray-500 text-sm mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3">
                <li>• Basic readiness score</li>
                <li>• 3 assessments per month</li>
                <li>• High-level recommendations</li>
              </ul>
              <Link href="/assessment" className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Start Free
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border-indigo-200 border-2 shadow-sm">
            <div className="p-6">
              <div className="inline-block w-fit mb-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Most Popular</div>
              <h3 className="font-semibold leading-none mb-1.5">Basic</h3>
              <div className="text-gray-500 text-sm mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3">
                <li>• Detailed technical reports</li>
                <li>• Unlimited assessments</li>
                <li>• Remediation roadmaps</li>
                <li>• Priority support</li>
              </ul>
              <Link href="/auth" className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold leading-none mb-1.5">Professional</h3>
              <div className="text-gray-500 text-sm mb-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3">
                <li>• Enterprise compliance analysis</li>
                <li>• Consultant matching</li>
                <li>• Implementation guidance</li>
                <li>• SOC 2/ISO 27001 prep</li>
              </ul>
              <Link href="/auth" className="inline-flex items-center justify-center w-full mt-6 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
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
          <Link href="/assessment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Start Your Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
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
