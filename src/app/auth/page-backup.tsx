'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Shield,
  Mail,
  Lock,
  Github,
  Chrome,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, handle authentication here
      window.location.href = '/dashboard'
    }, 1500)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/assessment">Try Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Demo Notice */}
          <Card className="mb-6 bg-indigo-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Demo Mode</p>
                  <p className="text-xs text-indigo-700">
                    This is a demonstration. Authentication is simulated for preview purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to access your production readiness dashboard'
                  : 'Join thousands of developers using ProtoReady.ai'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Quick Demo Access */}
              <div className="mb-6">
                <Button 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Continue to Demo Dashboard
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  No signup required • Full feature access
                </p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="w-full">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <Label htmlFor="remember" className="ml-2 text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              {/* Toggle Form */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="p-0 h-auto ml-1"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>

              {/* Features Preview */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3">What you get:</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Production readiness assessments
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Expert consultant marketplace
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Detailed implementation roadmaps
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}