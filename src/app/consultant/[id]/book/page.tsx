'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Video,
  Phone,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock consultant data
const consultantData = {
  id: 'sarah-johnson',
  name: 'Sarah Johnson',
  title: 'Senior Full-Stack Developer',
  avatar: '/api/placeholder/150',
  rating: 4.9,
  reviews: 127,
  hourlyRate: 85,
  location: 'San Francisco, CA',
  timezone: 'PST (UTC-8)',
  responseTime: '2 hours',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
  bio: 'Experienced full-stack developer with 8+ years building scalable web applications. Specialized in React ecosystem, Node.js backends, and cloud infrastructure. Passionate about helping teams adopt modern development practices and improve code quality.',
  expertise: [
    'Frontend Architecture',
    'API Design',
    'Performance Optimization',
    'Code Review',
    'DevOps & CI/CD',
    'Database Design'
  ],
  availability: {
    '2024-01-15': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    '2024-01-16': ['10:00', '11:00', '13:00', '14:00', '15:00'],
    '2024-01-17': ['09:00', '10:00', '11:00', '16:00', '17:00'],
    '2024-01-18': ['09:00', '13:00', '14:00', '15:00', '16:00'],
    '2024-01-19': ['10:00', '11:00', '14:00', '15:00'],
    '2024-01-22': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
  },
  communicationMethods: [
    { type: 'video', label: 'Video Call', icon: Video, available: true },
    { type: 'audio', label: 'Audio Call', icon: Phone, available: true },
    { type: 'chat', label: 'Text Chat', icon: MessageSquare, available: false }
  ]
}

export default function BookConsultantPage() {
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [duration, setDuration] = useState<number>(1)
  const [communicationMethod, setCommunicationMethod] = useState<string>('video')
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    description: '',
    goals: '',
    timeline: ''
  })
  const [currentWeek, setCurrentWeek] = useState(new Date('2024-01-15'))
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const consultant = consultantData
  const totalCost = consultant.hourlyRate * duration

  // Generate week dates
  const getWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const weekDates = getWeekDates(currentWeek)

  const nextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(newDate)
  }

  const prevWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(newDate)
  }

  const handleBooking = async () => {
    setIsLoading(true)
    
    // Simulate booking process
    setTimeout(() => {
      setIsLoading(false)
      setStep(3) // Success step
    }, 2000)
  }

  const renderTimeSelection = () => (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Date & Time</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateStr = formatDate(date)
          const available = consultant.availability[dateStr] || []
          const isSelected = selectedDate === dateStr
          const isPast = date < new Date()
          
          return (
            <div key={dateStr} className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                {formatDisplayDate(date)}
              </div>
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`w-full h-12 text-xs ${
                  isPast ? 'opacity-50 cursor-not-allowed' : ''
                } ${available.length === 0 ? 'opacity-50' : ''}`}
                onClick={() => available.length > 0 && !isPast && setSelectedDate(dateStr)}
                disabled={isPast || available.length === 0}
              >
                {date.getDate()}
                {available.length > 0 && !isPast && (
                  <div className="text-xs text-green-600 mt-1">
                    {available.length} slots
                  </div>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-3">
          <h4 className="font-medium">Available Times</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(consultant.availability[selectedDate] || []).map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Duration */}
      {selectedTime && (
        <div className="space-y-3">
          <h4 className="font-medium">Session Duration</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((hours) => (
              <Button
                key={hours}
                variant={duration === hours ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(hours)}
              >
                {hours}h
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Total cost: <span className="font-semibold">${totalCost}</span>
          </p>
        </div>
      )}

      {/* Communication Method */}
      {selectedTime && (
        <div className="space-y-3">
          <h4 className="font-medium">Communication Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {consultant.communicationMethods.map((method) => {
              const IconComponent = method.icon
              return (
                <Button
                  key={method.type}
                  variant={communicationMethod === method.type ? "default" : "outline"}
                  className="flex items-center justify-center p-4 h-auto"
                  onClick={() => setCommunicationMethod(method.type)}
                  disabled={!method.available}
                >
                  <div className="text-center">
                    <IconComponent className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{method.label}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Project Details</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="projectTitle">Project Title *</Label>
          <Input
            id="projectTitle"
            value={projectDetails.title}
            onChange={(e) => setProjectDetails({...projectDetails, title: e.target.value})}
            placeholder="e.g., React App Performance Review"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            value={projectDetails.description}
            onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
            placeholder="Describe your current project, technology stack, and specific challenges you're facing..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="goals">Session Goals</Label>
          <Textarea
            id="goals"
            value={projectDetails.goals}
            onChange={(e) => setProjectDetails({...projectDetails, goals: e.target.value})}
            placeholder="What specific outcomes are you hoping to achieve from this consultation?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="timeline">Project Timeline</Label>
          <Input
            id="timeline"
            value={projectDetails.timeline}
            onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value})}
            placeholder="e.g., Need to launch in 2 weeks"
          />
        </div>
      </div>

      {/* Booking Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Consultant:</span>
              <span className="font-medium">{consultant.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-medium">
                {selectedDate && new Date(selectedDate).toLocaleDateString()} at {selectedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-medium capitalize">{communicationMethod} call</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total Cost:</span>
              <span className="font-bold">${totalCost}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">
          Your consultation with {consultant.name} has been scheduled.
        </p>
      </div>

      <Card className="bg-blue-50 text-left">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• You&apos;ll receive a confirmation email with meeting details</li>
            <li>• Calendar invite will be sent with video call link</li>
            <li>• {consultant.name} will contact you before the session</li>
            <li>• Payment will be processed after the consultation</li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Booking ID: <span className="font-mono font-medium">BOOK-{Date.now()}</span>
        </p>
        
        <div className="flex space-x-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/marketplace">Browse More Consultants</Link>
          </Button>
        </div>
      </div>
    </div>
  )

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
              <h1 className="text-xl font-semibold text-gray-900">Book Consultation</h1>
              <p className="text-sm text-gray-600">Schedule time with {consultant.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {step < 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Consultant Info Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={consultant.avatar} alt={consultant.name} />
                        <AvatarFallback>{consultant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">{consultant.name}</h2>
                        <p className="text-sm text-gray-600">{consultant.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{consultant.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({consultant.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-semibold">${consultant.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span>{consultant.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Response Time:</span>
                        <span>{consultant.responseTime}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Expertise</h3>
                      <div className="flex flex-wrap gap-1">
                        {consultant.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {consultant.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{consultant.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          {step === 1 ? 'Select Date & Time' : 'Project Information'}
                        </CardTitle>
                        <CardDescription>
                          {step === 1 
                            ? 'Choose your preferred consultation time'
                            : 'Tell us about your project and goals'
                          }
                        </CardDescription>
                      </div>
                      <div className="text-sm text-gray-500">
                        Step {step} of 2
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {step === 1 && renderTimeSelection()}
                    {step === 2 && renderProjectDetails()}

                    <div className="flex justify-between pt-6 mt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                      >
                        Previous
                      </Button>
                      
                      {step === 1 ? (
                        <Button
                          onClick={() => setStep(2)}
                          disabled={!selectedDate || !selectedTime}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleBooking}
                          disabled={isLoading || !projectDetails.title || !projectDetails.description}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Booking...
                            </>
                          ) : (
                            <>
                              Confirm Booking (${totalCost})
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              {renderSuccess()}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}