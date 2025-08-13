'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Shield, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react'

interface ProtectedAssessmentProps {
  children: React.ReactNode
}

export function ProtectedAssessment({ children }: ProtectedAssessmentProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/assessment/submit')
    }
  }, [status, router])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated state - show sign in prompt
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sign In Required
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Please sign in to access the assessment wizard. We require authentication to:
              </p>
              <div className="text-left mb-8 max-w-md mx-auto space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">Provide personalized recommendations</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">Save your assessment history</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">Connect you with relevant consultants</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-700">Ensure secure data handling</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/auth/signin?callbackUrl=/assessment/submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Sign In with GitHub
                </Link>
                <Link 
                  href="/auth/signin?callbackUrl=/assessment/submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Sign In with Google
                </Link>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p>
                  Don't have an account? Signing in will automatically create one for you.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Authenticated state - render children
  if (session?.user) {
    return <>{children}</>
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Something went wrong. Please try again.</p>
      </div>
    </div>
  )
}

export default ProtectedAssessment