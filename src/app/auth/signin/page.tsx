'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Github, Mail } from 'lucide-react'

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ProtoReady.ai
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preferred authentication method
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          {providers && Object.values(providers).map((provider: any) => (
            <div key={provider.name}>
              <button
                onClick={() => handleSignIn(provider.id)}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  {provider.id === 'github' && <Github className="h-5 w-5 text-gray-500" />}
                  {provider.id === 'google' && <Mail className="h-5 w-5 text-gray-500" />}
                </span>
                <span className="ml-6">
                  Sign in with {provider.name}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Secure authentication powered by NextAuth
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}