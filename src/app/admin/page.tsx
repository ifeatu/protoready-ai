'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Users,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Star,
  Flag,
  Eye,
  Edit,
  Trash2,
  Download,
  Shield,
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck,
  FileText
} from 'lucide-react'

// Mock data for admin dashboard
const dashboardStats = {
  totalConsultants: 147,
  activeConsultants: 89,
  pendingApplications: 12,
  totalBookings: 1234,
  monthlyRevenue: 45600,
  averageRating: 4.7,
  flaggedReviews: 3,
  activeDisputes: 1
}

const pendingConsultants = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    title: 'DevOps Engineer',
    experience: '6 years',
    appliedDate: '2024-01-12',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    hourlyRate: 95,
    status: 'pending'
  },
  {
    id: '2', 
    name: 'Maria Garcia',
    email: 'maria@example.com',
    title: 'Frontend Specialist',
    experience: '4 years',
    appliedDate: '2024-01-10',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    hourlyRate: 80,
    status: 'under_review'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john@example.com', 
    title: 'Security Consultant',
    experience: '8 years',
    appliedDate: '2024-01-08',
    skills: ['Penetration Testing', 'OWASP', 'Security Audits'],
    hourlyRate: 125,
    status: 'interview_scheduled'
  }
]

const flaggedContent = [
  {
    id: '1',
    type: 'review',
    reporter: 'Client A',
    subject: 'Inappropriate language in review',
    content: 'This consultant was extremely unprofessional and used inappropriate language...',
    date: '2024-01-11',
    status: 'pending',
    consultantId: 'sarah-johnson'
  },
  {
    id: '2',
    type: 'profile',
    reporter: 'System',
    subject: 'Duplicate profile detected',
    content: 'Potential duplicate profile with similar credentials and contact information',
    date: '2024-01-09',
    status: 'investigating',
    consultantId: 'mike-chen'
  }
]

const recentBookings = [
  {
    id: '1',
    client: 'TechStart Inc.',
    consultant: 'Sarah Johnson',
    project: 'React Performance Optimization',
    date: '2024-01-15',
    duration: '2 hours',
    amount: 170,
    status: 'completed'
  },
  {
    id: '2',
    client: 'Digital Solutions',
    consultant: 'Marcus Chen',
    project: 'DevOps Consultation',
    date: '2024-01-14',
    duration: '3 hours',
    amount: 450,
    status: 'in_progress'
  },
  {
    id: '3',
    client: 'StartupXYZ',
    consultant: 'Elena Rodriguez',
    project: 'Database Optimization',
    date: '2024-01-13',
    duration: '4 hours',
    amount: 540,
    status: 'completed'
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null)

  const handleApproveConsultant = (id: string) => {
    console.log('Approving consultant:', id)
    // In real app, make API call
  }

  const handleRejectConsultant = (id: string) => {
    console.log('Rejecting consultant:', id)
    // In real app, make API call
  }

  const handleFlaggedContent = (id: string, action: 'approve' | 'remove') => {
    console.log(`${action} flagged content:`, id)
    // In real app, make API call
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'investigating': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">ProtoReady.ai Marketplace Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalConsultants}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.activeConsultants} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.monthlyRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    This month: 89
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all consultants
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Applications
                  </CardTitle>
                  <CardDescription>
                    {dashboardStats.pendingApplications} consultants awaiting review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingConsultants.slice(0, 3).map((consultant) => (
                    <div key={consultant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{consultant.name}</p>
                        <p className="text-sm text-gray-600">{consultant.title}</p>
                        <Badge className={getStatusColor(consultant.status)}>
                          {consultant.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleApproveConsultant(consultant.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectConsultant(consultant.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Applications
                  </Button>
                </CardContent>
              </Card>

              {/* Flagged Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flag className="h-5 w-5 mr-2" />
                    Flagged Content
                  </CardTitle>
                  <CardDescription>
                    {dashboardStats.flaggedReviews} items need attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {flaggedContent.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <p className="font-medium text-sm">{item.subject}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" onClick={() => handleFlaggedContent(item.id, 'approve')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleFlaggedContent(item.id, 'remove')}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest consultant bookings and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.project}</p>
                        <p className="text-sm text-gray-600">
                          {booking.client} → {booking.consultant}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{booking.date}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{booking.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.amount)}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultants Tab */}
          <TabsContent value="consultants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultant Management</CardTitle>
                <CardDescription>Manage consultant applications and profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingConsultants.map((consultant) => (
                    <div key={consultant.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {consultant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{consultant.name}</h3>
                              <p className="text-sm text-gray-600">{consultant.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Title:</span>
                              <span className="ml-2">{consultant.title}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Experience:</span>
                              <span className="ml-2">{consultant.experience}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Rate:</span>
                              <span className="ml-2">${consultant.hourlyRate}/hour</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Applied:</span>
                              <span className="ml-2">{consultant.appliedDate}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {consultant.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(consultant.status)}>
                            {consultant.status.replace('_', ' ')}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" onClick={() => handleApproveConsultant(consultant.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectConsultant(consultant.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Monitor and manage all consultant bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Booking management interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>Moderate reviews and handle disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Review management interface would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Handle flagged content and user reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedContent.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(item.status)}>
                              {item.type}
                            </Badge>
                            <span className="text-sm text-gray-500">Reported by {item.reporter}</span>
                          </div>
                          <h3 className="font-medium">{item.subject}</h3>
                          <p className="text-sm text-gray-600">{item.content}</p>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleFlaggedContent(item.id, 'approve')}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleFlaggedContent(item.id, 'remove')}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard would be implemented here with charts and metrics.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}