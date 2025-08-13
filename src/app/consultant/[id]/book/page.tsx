'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  User,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('1')
  const [projectDescription, setProjectDescription] = useState('')
  const [urgency, setUrgency] = useState('normal')

  // Mock consultant data - in real app, fetch based on params.id
  const consultant = {
    id: params.id,
    name: 'Sarah Johnson',
    title: 'Senior React & Next.js Developer',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 85,
    location: 'San Francisco, CA',
    avatar: '',
    specialties: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AWS'],
    availability: 'Available this week'
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Booking submitted:', {
      consultant: consultant.id,
      date: selectedDate,
      time: selectedTime,
      duration,
      projectDescription,
      urgency
    })
    // Booking logic would go here
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Book Consultation</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultant Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{consultant.name}</h2>
                  <p className="text-gray-600 text-sm">{consultant.title}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium">{consultant.rating}</span>
                  <span className="text-sm text-gray-600 ml-1">({consultant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">${consultant.hourlyRate}/hour</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{consultant.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-green-600">{consultant.availability}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {consultant.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${parseInt(duration) * consultant.hourlyRate}
                </div>
                <div className="text-sm text-gray-600">
                  Total for {duration} hour{parseInt(duration) !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Schedule Your Consultation</h2>
              
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time (PST)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          selectedTime === time
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {!selectedTime && (
                    <p className="text-red-500 text-sm mt-1">Please select a time slot</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Describe your project, specific challenges, and what you'd like help with..."
                    required
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low - General guidance</option>
                    <option value="normal">Normal - Active development</option>
                    <option value="high">High - Pre-launch support</option>
                    <option value="urgent">Urgent - Production issues</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedTime}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Book Consultation (${parseInt(duration) * consultant.hourlyRate})
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What to expect:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Video call link will be sent 24 hours before</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Session recordings available for 30 days</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Follow-up summary and action items</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>100% money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}