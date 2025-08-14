'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react'
import { Suspense } from 'react'

const getErrorMessage = (errorType: string | null) => {
  switch (errorType) {
    case 'Configuration':
      return {
        title: 'Configuration Error',
        message: 'There is a problem with the authentication configuration. Please contact support.',
        suggestion: 'This is usually a temporary issue with our authentication service.'
      }
    case 'AccessDenied':
      return {
        title: 'Access Denied',
        message: 'You do not have permission to sign in to this application.',
        suggestion: 'Please check if you are using the correct account or contact support for access.'
      }
    case 'Verification':
      return {
        title: 'Verification Error',
        message: 'The verification link has expired or is invalid.',
        suggestion: 'Please request a new verification link and try signing in again.'
      }
    case 'OAuthSignin':
      return {
        title: 'OAuth Provider Error',
        message: 'There was an error connecting to the OAuth provider.',
        suggestion: 'Please try signing in again or use a different authentication method.'
      }
    case 'OAuthCallback':
      return {
        title: 'OAuth Callback Error',
        message: 'There was an error during the OAuth callback process.',
        suggestion: 'Please try signing in again. If this persists, try clearing your browser cache.'
      }
    case 'SessionRequired':
      return {
        title: 'Session Required',
        message: 'You need to be signed in to access this page.',
        suggestion: 'Please sign in to continue.'
      }
    default:
      return {
        title: 'Authentication Error',
        message: 'An unexpected error occurred during authentication.',
        suggestion: 'Please try signing in again. If this problem persists, contact support.'
      }
  }
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const errorInfo = getErrorMessage(error)

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-4">
            {errorInfo.message}
          </p>

          {/* Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-blue-800 text-sm">
                {errorInfo.suggestion}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/auth/signin"
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Signing In Again
            </Link>
            
            <Link 
              href="/"
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Still having trouble?
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                • Try clearing your browser cache and cookies
              </p>
              <p className="text-sm text-gray-600">
                • Disable browser extensions that might interfere
              </p>
              <p className="text-sm text-gray-600">
                • Contact our support team if the problem persists
              </p>
            </div>
          </div>

          {/* Debug Info */}
          {error && (
            <div className="mt-6 p-3 bg-gray-100 rounded text-left">
              <p className="text-xs text-gray-500 font-mono">
                Error Code: {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Authentication Error
                </h1>
                <p className="text-gray-600">
                  Loading error details...
                </p>
              </div>
            </div>
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </main>
    </div>
  )
}