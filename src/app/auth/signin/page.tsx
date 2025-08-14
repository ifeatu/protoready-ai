'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Github, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [callbackUrl, router])

  useEffect(() => {
    // Handle OAuth errors
    if (errorParam) {
      switch (errorParam) {
        case 'OAuthSignin':
          setError('Error with OAuth provider. Please try again.')
          break
        case 'OAuthCallback':
          setError('Error in OAuth callback. Please try again.')
          break
        case 'OAuthCreateAccount':
          setError('Could not create OAuth account. Please try again.')
          break
        case 'EmailCreateAccount':
          setError('Could not create account. Please try again.')
          break
        case 'Callback':
          setError('Error in callback. Please try again.')
          break
        case 'OAuthAccountNotLinked':
          setError('OAuth account not linked. Please use the same provider you used to sign up.')
          break
        case 'EmailSignin':
          setError('Error sending email. Please try again.')
          break
        case 'CredentialsSignin':
          setError('Invalid credentials. Please check your email and password.')
          break
        case 'SessionRequired':
          setError('Please sign in to access this page.')
          break
        default:
          setError('Authentication error. Please try again.')
      }
    }
  }, [errorParam])

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn(provider, { 
        callbackUrl,
        redirect: false 
      })
      
      if (result?.error) {
        setError('Authentication failed. Please try again.')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in to ProtoReady.ai
              </h1>
              <p className="text-gray-600">
                Access your production readiness assessments
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleOAuthSignIn('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <Github className="h-5 w-5 mr-3" />
                )}
                Continue with GitHub
              </button>

              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <Mail className="h-5 w-5 mr-3" />
                )}
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure authentication</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                By signing in, you'll get access to:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-indigo-600 mr-2" />
                  Personalized assessment reports
                </li>
                <li className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-indigo-600 mr-2" />
                  Assessment history tracking
                </li>
                <li className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-indigo-600 mr-2" />
                  Expert consultant connections
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                New to ProtoReady.ai?{' '}
                <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              We use secure OAuth authentication. Your credentials are never stored on our servers.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}