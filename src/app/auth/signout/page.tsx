'use client'

import { useState, useEffect } from 'react'
import { signOut, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, LogOut, Loader2, CheckCircle } from 'lucide-react'

export default function SignOutPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isSignedOut, setIsSignedOut] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    // Get user info before signing out
    getSession().then((session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      } else {
        // User is already signed out
        setIsSignedOut(true)
      }
    })
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      })
      
      setIsSignedOut(true)
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      console.error('Sign out error:', err)
      // Still redirect even if there's an error
      router.push('/')
    }
  }

  const handleCancelSignOut = () => {
    router.back()
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
            
            {/* Success State */}
            {isSignedOut ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  You've been signed out
                </h1>
                <p className="text-gray-600 mb-6">
                  Thank you for using ProtoReady.ai. You have been successfully signed out of your account.
                </p>
                <div className="space-y-4">
                  <Link 
                    href="/"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Return to Home
                  </Link>
                  <Link 
                    href="/auth/signin"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Sign In Again
                  </Link>
                </div>
              </div>
            ) : (
              /* Confirmation State */
              <div className="text-center">
                <LogOut className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Sign out of ProtoReady.ai?
                </h1>
                {userEmail && (
                  <p className="text-gray-600 mb-6">
                    You are currently signed in as <strong>{userEmail}</strong>
                  </p>
                )}
                <p className="text-gray-600 mb-8">
                  You will lose access to your assessment history and consultant connections until you sign in again.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Signing out...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-5 w-5 mr-2" />
                        Yes, sign me out
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelSignOut}
                    disabled={isSigningOut}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Benefits Reminder */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    By staying signed in, you keep access to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your assessment history</li>
                    <li>• Personalized recommendations</li>
                    <li>• Consultant connections</li>
                    <li>• Subscription benefits</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}