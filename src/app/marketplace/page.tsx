'use client'

import { useState, useEffect } from 'react'
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
  reviews: number
  location: string
  availability: 'available' | 'busy' | 'unavailable'
  avatar: string
  responseTime: string
  completedProjects: number
}

export default function MarketplacePage() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockConsultants: Consultant[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Senior Full-Stack Developer',
        bio: 'Experienced developer specializing in React, Node.js, and cloud architecture. Helped 50+ startups scale their applications.',
        specializations: ['React', 'Node.js', 'AWS', 'TypeScript'],
        hourlyRate: 125,
        rating: 4.9,
        reviews: 43,
        location: 'San Francisco, CA',
        availability: 'available',
        avatar: '/avatars/sarah.jpg',
        responseTime: '< 1 hour',
        completedProjects: 23
      },
      {
        id: '2',
        name: 'Michael Chen',
        title: 'DevOps & Security Expert',
        bio: 'Expert in DevOps practices and security implementation. Specializes in CI/CD pipelines and cloud security.',
        specializations: ['DevOps', 'Security', 'Docker', 'Kubernetes'],
        hourlyRate: 150,
        rating: 4.8,
        reviews: 31,
        location: 'Seattle, WA',
        availability: 'busy',
        avatar: '/avatars/michael.jpg',
        responseTime: '< 2 hours',
        completedProjects: 18
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        title: 'Mobile Development Specialist',
        bio: 'React Native and Flutter expert with 8+ years of mobile development experience. Built 30+ mobile apps.',
        specializations: ['React Native', 'Flutter', 'Mobile', 'iOS'],
        hourlyRate: 135,
        rating: 5.0,
        reviews: 27,
        location: 'Austin, TX',
        availability: 'available',
        avatar: '/avatars/emily.jpg',
        responseTime: '< 30 min',
        completedProjects: 35
      }
    ]

    setTimeout(() => {
      setConsultants(mockConsultants)
      setFilteredConsultants(mockConsultants)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = consultants.filter(consultant =>
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.specializations.some(spec => 
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(consultant =>
        consultant.specializations.some(spec =>
          spec.toLowerCase().includes(selectedSpecialization.toLowerCase())
        )
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'experience':
          return b.completedProjects - a.completedProjects
        default:
          return 0
      }
    })

    setFilteredConsultants(filtered)
  }, [searchTerm, selectedSpecialization, sortBy, consultants])

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'busy': return 'text-yellow-600 bg-yellow-100'
      case 'unavailable': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSpecializationIcon = (spec: string) => {
    switch (spec.toLowerCase()) {
      case 'react':
      case 'react native':
        return <Code className="h-4 w-4" />
      case 'node.js':
        return <Database className="h-4 w-4" />
      case 'devops':
        return <Zap className="h-4 w-4" />
      case 'security':
        return <Shield className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
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
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/consultant/apply" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Become a Consultant
            </Link>
            <Link href="/auth" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Consultants</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with vetted developers to make your prototype production-ready
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search consultants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Specialization Filter */}
              <div>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Specializations</option>
                  <option value="react">React</option>
                  <option value="node">Node.js</option>
                  <option value="devops">DevOps</option>
                  <option value="security">Security</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center md:justify-end">
                <span className="text-sm text-gray-600">
                  {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </div>

          {/* Consultants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultants.map((consultant) => (
              <div key={consultant.id} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {consultant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                        <p className="text-sm text-gray-600">{consultant.title}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(consultant.availability)}`}>
                      {consultant.availability}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{consultant.bio}</p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {consultant.specializations.map((spec, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {getSpecializationIcon(spec)}
                        <span className="ml-1">{spec}</span>
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{consultant.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{consultant.reviews} reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-semibold">{consultant.responseTime}</span>
                      </div>
                      <p className="text-xs text-gray-600">response time</p>
                    </div>
                  </div>

                  {/* Location & Rate */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {consultant.location}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${consultant.hourlyRate}/hr</p>
                      <p className="text-xs text-gray-600">{consultant.completedProjects} projects</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/consultant/${consultant.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/consultant/${consultant.id}/book`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredConsultants.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialization('all')
                  setSortBy('rating')
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-white rounded-xl border shadow-sm p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Not sure which consultant is right for your project? Our team can help match you with the perfect expert based on your specific needs and requirements.
            </p>
            <Link href="/assessment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Start Free Assessment
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}