'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Github, Mail, User, LogOut } from 'lucide-react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm font-medium">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => signIn('github')}
        className="flex items-center space-x-2 px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-900 text-white text-sm transition-colors duration-200"
      >
        <Github className="h-4 w-4" />
        <span>GitHub</span>
      </button>
      <button
        onClick={() => signIn('google')}
        className="flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors duration-200"
      >
        <Mail className="h-4 w-4" />
        <span>Google</span>
      </button>
    </div>
  )
}