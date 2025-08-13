// Minimal Admin Page for Testing Module Resolution
'use client'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">ProtoReady.ai Marketplace Management</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-600">
            This is a minimal admin dashboard page for testing deployment.
            The full admin functionality will be restored once the module resolution issue is fixed.
          </p>
        </div>
      </main>
    </div>
  )
}