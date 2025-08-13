'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Star,
  MapPin,
  Clock,
  Shield,
  Zap,
  Users,
  Code,
  Database,
  Globe,
  MessageCircle,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface Consultant {
  id: string
  name: string
  title: string
  bio: string
  specializations: string[]
  hourlyRate: number
  rating: number
  totalReviews: number
  totalProjects: number
  availability: string
  location: string
  profileImage: string
  verified: boolean
}

export default function MarketplacePage() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const specializations = [
    'Security & Compliance',
    'DevOps & Infrastructure', 
    'Performance Optimization',
    'API Architecture',
    'Legacy System Migration',
    'Frontend Development',
    'Backend Development'
  ]

  useEffect(() => {
    // Mock data for demonstration
    const mockConsultants: Consultant[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Senior Full-Stack Engineer',
        bio: 'Specializing in React, Node.js, and cloud deployments with 8+ years experience. Helped 50+ startups scale from prototype to production.',
        specializations: ['Performance Optimization', 'API Architecture', 'Frontend Development'],
        hourlyRate: 120,
        rating: 4.9,
        totalReviews: 47,
        totalProjects: 63,
        availability: 'Available',
        location: 'San Francisco, CA',
        profileImage: '/api/placeholder/100/100',
        verified: true
      },
      {
        id: '2', 
        name: 'Marcus Chen',
        title: 'DevOps & Security Specialist',
        bio: 'Expert in Kubernetes, CI/CD, and enterprise security. SOC 2 compliance specialist with Fortune 500 experience.',
        specializations: ['DevOps & Infrastructure', 'Security & Compliance'],
        hourlyRate: 150,
        rating: 4.8,
        totalReviews: 32,
        totalProjects: 41,
        availability: 'Available',
        location: 'Austin, TX',
        profileImage: '/api/placeholder/100/100',
        verified: true
      },
      {
        id: '3',
        name: 'Elena Rodriguez',
        title: 'Performance Engineer',
        bio: 'Performance optimization expert with deep knowledge of web vitals, database optimization, and scalability patterns.',
        specializations: ['Performance Optimization', 'Backend Development'],
        hourlyRate: 135,
        rating: 4.7,
        totalReviews: 29,
        totalProjects: 38,
        availability: 'Busy until Jan 30',
        location: 'Remote',
        profileImage: '/api/placeholder/100/100',
        verified: true
      },
      {
        id: '4',
        name: 'David Kim',
        title: 'Enterprise Architect',
        bio: 'Specialized in legacy system modernization and microservices architecture. 12+ years building scalable enterprise solutions.',
        specializations: ['Legacy System Migration', 'API Architecture', 'DevOps & Infrastructure'],
        hourlyRate: 160,
        rating: 4.9,
        totalReviews: 55,
        totalProjects: 72,
        availability: 'Available',
        location: 'Seattle, WA',
        profileImage: '/api/placeholder/100/100',
        verified: true
      },
      {
        id: '5',
        name: 'Priya Patel',
        title: 'Security Consultant',
        bio: 'Cybersecurity expert with CISSP certification. Specialized in application security, penetration testing, and compliance audits.',
        specializations: ['Security & Compliance'],
        hourlyRate: 140,
        rating: 4.8,
        totalReviews: 41,
        totalProjects: 49,
        availability: 'Available',
        location: 'Remote',
        profileImage: '/api/placeholder/100/100',
        verified: true
      }
    ]

    setTimeout(() => {
      setConsultants(mockConsultants)
      setLoading(false)
    }, 800)
  }, [])

  const filteredConsultants = consultants
    .filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.specializations.some(spec => 
                             spec.toLowerCase().includes(searchTerm.toLowerCase())
                           )
      
      const matchesSpecialization = selectedSpecialization === 'all' ||
                                   consultant.specializations.includes(selectedSpecialization)
      
      return matchesSearch && matchesSpecialization
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'experience':
          return b.totalProjects - a.totalProjects
        default:
          return 0
      }
    })

  const getSpecializationIcon = (spec: string) => {
    switch (spec) {
      case 'Security & Compliance': return <Shield className="h-4 w-4" />
      case 'Performance Optimization': return <Zap className="h-4 w-4" />
      case 'DevOps & Infrastructure': return <Database className="h-4 w-4" />
      case 'API Architecture': return <Code className="h-4 w-4" />
      case 'Frontend Development': return <Globe className="h-4 w-4" />
      case 'Backend Development': return <Database className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading consultants...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/consultant/apply">Join as Consultant</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Consultants</h1>
            <p className="text-gray-600">
              Connect with vetted developers specialized in production deployment and scaling
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search consultants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {filteredConsultants.length} consultants found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsultants.map((consultant) => (
              <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {consultant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {consultant.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{consultant.rating}</span>
                          <span className="text-sm text-gray-500">({consultant.totalReviews})</span>
                        </div>
                      </div>

                      <p className="text-indigo-600 font-medium mb-2">{consultant.title}</p>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{consultant.bio}</p>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {consultant.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {getSpecializationIcon(spec)}
                            <span className="ml-1">{spec}</span>
                          </Badge>
                        ))}
                        {consultant.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{consultant.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {consultant.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {consultant.totalProjects} projects
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {consultant.availability}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">${consultant.hourlyRate}</span>
                          <span className="text-gray-600">/hour</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/consultant/${consultant.id}/book`}>
                              Book Session
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredConsultants.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all consultants
              </p>
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedSpecialization('all')
              }}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Become a ProtoReady Consultant</h2>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Join our network of expert developers and help teams bridge the gap from prototype to production. 
                Earn competitive rates while working on cutting-edge projects.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/consultant/apply">
                  Apply as Consultant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}