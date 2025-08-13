'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star,
  ThumbsUp,
  Shield,
  ArrowLeft,
  Filter,
  Calendar,
  CheckCircle,
  Flag,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  clientName: string
  clientCompany: string
  clientAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  projectType: string
  verified: boolean
  helpful: number
  response?: {
    content: string
    date: string
  }
}

const mockReviews: Review[] = [
  {
    id: '1',
    clientName: 'Mike Chen',
    clientCompany: 'TechStart Inc.',
    clientAvatar: '/api/placeholder/40',
    rating: 5,
    title: 'Outstanding Performance Optimization',
    comment: 'Sarah exceeded our expectations with her React performance optimization work. She identified critical bottlenecks in our application and provided a comprehensive solution that improved our load times by 60%. Her communication was excellent throughout the project, and she delivered ahead of schedule. I would definitely work with her again.',
    date: '2024-01-10',
    projectType: 'Performance Optimization',
    verified: true,
    helpful: 12,
    response: {
      content: 'Thank you Mike! It was a pleasure working with your team. The performance improvements we implemented should scale well as your user base grows. Feel free to reach out if you need any follow-up assistance.',
      date: '2024-01-11'
    }
  },
  {
    id: '2',
    clientName: 'Lisa Rodriguez',
    clientCompany: 'Digital Solutions LLC',
    clientAvatar: '/api/placeholder/40',
    rating: 5,
    title: 'Expert Code Review and Architecture Guidance',
    comment: 'Sarah provided an incredibly thorough code review of our React application. Her insights into component architecture and state management helped us refactor our codebase for better maintainability. She also provided excellent documentation and recommendations for our development process.',
    date: '2024-01-05',
    projectType: 'Code Review',
    verified: true,
    helpful: 8
  },
  {
    id: '3',
    clientName: 'James Wilson',
    clientCompany: 'Innovation Labs',
    clientAvatar: '/api/placeholder/40',
    rating: 4,
    title: 'Solid API Architecture Consultation',
    comment: 'Good consultation on our API architecture. Sarah provided valuable insights on scalability patterns and helped us design a more robust backend structure. The only minor issue was some delay in initial communication, but once we got started, everything went smoothly.',
    date: '2023-12-28',
    projectType: 'API Architecture',
    verified: true,
    helpful: 5,
    response: {
      content: 'Thanks James! I apologize for the initial delay - I was traveling during the holidays. I\'m glad we could achieve your architectural goals. The patterns we implemented should serve you well as you scale.',
      date: '2023-12-29'
    }
  },
  {
    id: '4',
    clientName: 'Amanda Foster',
    clientCompany: 'StartupXYZ',
    clientAvatar: '/api/placeholder/40',
    rating: 5,
    title: 'Incredible Knowledge and Professionalism',
    comment: 'Sarah is an absolute expert in modern web development. Her knowledge of React, TypeScript, and performance optimization is impressive. She helped us resolve complex technical debt issues and provided a clear roadmap for future development. Highly recommended!',
    date: '2023-12-20',
    projectType: 'Technical Debt Resolution',
    verified: true,
    helpful: 15
  },
  {
    id: '5',
    clientName: 'David Park',
    clientCompany: 'FinTech Solutions',
    clientAvatar: '/api/placeholder/40',
    rating: 5,
    title: 'Security Review Excellence',
    comment: 'Outstanding security review of our payment processing system. Sarah identified several potential vulnerabilities and provided detailed remediation plans. Her attention to detail and security expertise gave us confidence in our production deployment.',
    date: '2023-12-15',
    projectType: 'Security Review',
    verified: true,
    helpful: 9
  }
]

export default function ConsultantReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  })

  const consultant = {
    name: 'Sarah Johnson',
    title: 'Senior Full-Stack Developer',
    avatar: '/api/placeholder/80',
    rating: 4.9,
    totalReviews: 127
  }

  const filteredReviews = reviews
    .filter(review => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'helpful':
          return b.helpful - a.helpful
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }))

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  const renderStars = (rating: number, interactive = false, size = 'h-4 w-4') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setNewReview({...newReview, rating: star}) : undefined}
          />
        ))}
      </div>
    )
  }

  const handleSubmitReview = () => {
    // In real app, submit to API
    console.log('Submitting review:', newReview)
    setShowWriteReview(false)
    setNewReview({ rating: 0, title: '', comment: '' })
  }

  const markHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Reviews</h1>
              <p className="text-sm text-gray-600">Client feedback for {consultant.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews Overview Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {/* Consultant Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={consultant.avatar} alt={consultant.name} />
                      <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">{consultant.name}</h2>
                      <p className="text-sm text-gray-600">{consultant.title}</p>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    {renderStars(Math.round(averageRating), false, 'h-6 w-6')}
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {reviews.length} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2 mb-6">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <button
                          onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                          className={`flex items-center space-x-1 text-sm hover:text-indigo-600 ${
                            filterRating === rating ? 'text-indigo-600 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <span>{rating}</span>
                          <Star className="h-3 w-3 fill-current" />
                        </button>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Write Review Button */}
                  <Button 
                    className="w-full"
                    onClick={() => setShowWriteReview(true)}
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters and Sort */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {filterRating ? `${filterRating} star reviews` : 'All reviews'}
                        </span>
                        {filterRating && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterRating(null)}
                            className="text-xs"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="helpful">Most Helpful</option>
                      <option value="rating">Highest Rating</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Write Review Modal */}
              {showWriteReview && (
                <Card className="border-indigo-200">
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                    <CardDescription>Share your experience working with {consultant.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Overall Rating</label>
                      {renderStars(newReview.rating, true, 'h-6 w-6')}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Review Title</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        placeholder="Summarize your experience"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share details about your experience..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button onClick={handleSubmitReview}>Submit Review</Button>
                      <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.clientAvatar} alt={review.clientName} />
                          <AvatarFallback>
                            {review.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{review.clientName}</h3>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{review.clientCompany}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{review.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {review.projectType}
                        </Badge>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Consultant Response */}
                    {review.response && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={consultant.avatar} alt={consultant.name} />
                            <AvatarFallback className="text-xs">
                              {consultant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{consultant.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(review.response.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{review.response.content}</p>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => markHelpful(review.id)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          <Flag className="h-4 w-4" />
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredReviews.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Star className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                    <p className="text-gray-600">
                      {filterRating 
                        ? `No ${filterRating} star reviews yet` 
                        : 'Be the first to leave a review!'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}