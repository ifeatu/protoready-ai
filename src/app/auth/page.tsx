'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to NextAuth signin page
    router.push('/auth/signin')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
          <p className="text-gray-600">Taking you to the sign-in page.</p>
        </div>
      </div>
    </div>
  )
}