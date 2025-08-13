'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  User,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface ReviewsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { id } = await params
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    projectType: ''
  })

  // Mock consultant data
  const consultant = {
    id: id,
    name: 'Sarah Johnson',
    title: 'Senior React & Next.js Developer',
    rating: 4.9,
    totalReviews: 127,
    responseRate: 98,
    completionRate: 100
  }

  // Mock reviews data
  const reviews = [
    {
      id: '1',
      clientName: 'Alex Chen',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent React optimization help',
      content: 'Sarah helped us optimize our React app performance issues. She identified several bottlenecks and provided clear solutions. Our page load times improved by 60% after implementing her recommendations.',
      projectType: 'Performance Optimization',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      clientName: 'Maria Rodriguez',
      rating: 5,
      date: '2024-01-10',
      title: 'Great TypeScript migration guidance',
      content: 'Very knowledgeable about TypeScript best practices. The migration plan she provided was detailed and easy to follow. Our team learned a lot during the process.',
      projectType: 'Code Migration',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      clientName: 'David Kim',
      rating: 4,
      date: '2024-01-08',
      title: 'Solid Next.js architecture advice',
      content: 'Sarah provided good architectural guidance for our Next.js application. The session was informative and she answered all our questions thoroughly.',
      projectType: 'Architecture Review',
      helpful: 15,
      verified: false
    },
    {
      id: '4',
      clientName: 'Jennifer Liu',
      rating: 5,
      date: '2024-01-05',
      title: 'Helpful deployment troubleshooting',
      content: 'Had a critical deployment issue and Sarah helped debug it quickly. She stayed late to ensure our production deployment was successful. Highly recommended!',
      projectType: 'Deployment Support',
      helpful: 20,
      verified: true
    }
  ]

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Review submitted:', newReview)
    // Review submission logic would go here
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer' : ''}`}
        onClick={() => interactive && setNewReview({...newReview, rating: i + 1})}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/consultant/${params.id}`}
                className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Consultant Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{consultant.name}</h2>
                <p className="text-gray-600">{consultant.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {renderStars(Math.floor(consultant.rating))}
                  <span className="ml-2 text-lg font-semibold">{consultant.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{consultant.totalReviews} reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{consultant.responseRate}%</div>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{consultant.completionRate}%</div>
                <p className="text-sm text-gray-600">Project Completion</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-sm text-gray-600">Verified Consultant</p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 mb-12">
            <h3 className="text-xl font-semibold">Client Reviews ({reviews.length})</h3>
            
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{review.clientName}</p>
                        {review.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {review.projectType}
                  </span>
                </div>

                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-gray-700">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(newReview.rating, true)}
                  <span className="ml-3 text-sm text-gray-600">
                    ({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief summary of your experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  value={newReview.projectType}
                  onChange={(e) => setNewReview({...newReview, projectType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select project type</option>
                  <option value="Bug Fixes">Bug Fixes</option>
                  <option value="Performance Optimization">Performance Optimization</option>
                  <option value="Feature Development">Feature Development</option>
                  <option value="Code Review">Code Review</option>
                  <option value="Architecture Design">Architecture Design</option>
                  <option value="Deployment Support">Deployment Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={6}
                  placeholder="Share your experience working with this consultant. What did they help you with? How was the communication and quality of work?"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters. Be specific about what the consultant helped you achieve.
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Review
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Review Guidelines:</strong> Please be honest and constructive in your feedback. 
                Reviews help other clients make informed decisions and help consultants improve their services.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}