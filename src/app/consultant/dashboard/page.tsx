'use client'

import { useState } from 'react'
import { 
  DollarSign,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function ConsultantDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = {
    totalEarnings: 12450,
    completedProjects: 23,
    activeProjects: 3,
    averageRating: 4.9,
    responseTime: '< 2 hours',
    completionRate: 98
  }

  const projects = [
    {
      id: '1',
      title: 'E-commerce Platform Security Review',
      client: 'TechStart Inc.',
      status: 'in-progress',
      deadline: '2024-01-20',
      earnings: 2500,
      progress: 65
    },
    {
      id: '2',
      title: 'Mobile App Performance Optimization',
      client: 'QuickApp Solutions',
      status: 'completed',
      deadline: '2024-01-15',
      earnings: 1800,
      progress: 100
    },
    {
      id: '3',
      title: 'Database Migration & Scaling',
      client: 'DataFlow Co.',
      status: 'pending',
      deadline: '2024-01-25',
      earnings: 3200,
      progress: 0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
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
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SJ</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Sarah Johnson</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah!</h1>
            <p className="text-gray-600">Here's your consultant dashboard overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-lg font-bold text-gray-900">{stats.responseTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border shadow-sm mb-8">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'projects'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('earnings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'earnings'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Earnings
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Project completed</p>
                          <p className="text-sm text-gray-600">Mobile App Performance Optimization</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">New message from client</p>
                          <p className="text-sm text-gray-600">TechStart Inc.</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Payment received</p>
                          <p className="text-sm text-gray-600">$1,800 from QuickApp Solutions</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                    <Link href="/marketplace" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      Browse New Projects
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-sm text-gray-600">{project.client}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Due: {new Date(project.deadline).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            ${project.earnings.toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {project.progress}% Complete
                          </div>
                        </div>
                        
                        {project.status === 'in-progress' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                          {project.status === 'in-progress' && (
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded text-indigo-700 hover:bg-indigo-50 transition-colors">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message Client
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Earnings Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-800">This Month</p>
                          <p className="text-2xl font-bold text-green-900">$4,250</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-800">Last Month</p>
                          <p className="text-2xl font-bold text-blue-900">$3,800</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                      <div className="flex items-center">
                        <Star className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-800">Avg. Monthly</p>
                          <p className="text-2xl font-bold text-purple-900">$4,150</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {[
                        { client: 'QuickApp Solutions', amount: 1800, date: '2024-01-15', project: 'Mobile App Performance' },
                        { client: 'DataFlow Co.', amount: 1200, date: '2024-01-10', project: 'Initial Consultation' },
                        { client: 'TechStart Inc.', amount: 900, date: '2024-01-08', project: 'Security Audit Phase 1' }
                      ].map((payment, index) => (
                        <div key={index} className="px-6 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{payment.client}</p>
                            <p className="text-sm text-gray-600">{payment.project}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}