import Link from 'next/link'
import { Shield, AlertCircle, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg border p-8">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              You don't have permission to access this page. This area is restricted to specific user roles.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Need Access?</h3>
              <div className="text-left text-sm text-gray-600 space-y-2">
                <p>• For consultant access: Apply to join our expert network</p>
                <p>• For admin access: Contact system administrators</p>
                <p>• For general support: Visit our help center</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
              
              <Link 
                href="/consultant/apply"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Apply as Consultant
              </Link>
            </div>

            <div className="mt-6">
              <Link 
                href="/help"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Need help? Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}