'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Shield,
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Award,
  Users,
  Clock,
  DollarSign
} from 'lucide-react'

interface FormData {
  fullName: string
  bio: string
  specializations: string[]
  yearsExperience: number
  hourlyRate: number
  portfolioData: {
    websites: string[]
  }
  resumeUrl: string
  linkedinUrl: string
  githubUrl: string
  timezone: string
}

const specializationOptions = [
  'Security & Compliance',
  'Performance Optimization', 
  'DevOps & Infrastructure',
  'API Architecture',
  'Database Design',
  'Frontend Development',
  'Mobile Development',
  'Cloud Architecture',
  'Microservices',
  'Testing & QA'
]

const timezones = [
  'UTC-8 (PST)', 'UTC-7 (MST)', 'UTC-6 (CST)', 'UTC-5 (EST)',
  'UTC+0 (GMT)', 'UTC+1 (CET)', 'UTC+2 (EET)', 'UTC+8 (CST)',
  'UTC+9 (JST)', 'UTC+10 (AEST)'
]

export default function ConsultantApplyPage() {
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    fullName: session?.user?.name || '',
    bio: '',
    specializations: [],
    yearsExperience: 0,
    hourlyRate: 95,
    portfolioData: {
      websites: ['']
    },
    resumeUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    timezone: 'UTC-5 (EST)'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(4) // Success step
    } catch (err) {
      setError('Application submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }))
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  // Unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <Award className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our Expert Network
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Please sign in to submit your consultant application. We use authentication to verify your identity and maintain a trusted network.
              </p>
              <Link 
                href="/auth/signin?callbackUrl=/consultant/apply"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Sign In to Apply
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min((step / 3) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center mb-8">
                <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Join Our Expert Network</h2>
                <p className="text-gray-600">Help developers transform their AI-built prototypes into production-ready applications</p>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-600">$95-150/hr</div>
                  <div className="text-sm text-gray-600">Premium rates</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-600">Quality Clients</div>
                  <div className="text-sm text-gray-600">Pre-vetted projects</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-600">Flexible Hours</div>
                  <div className="text-sm text-gray-600">Set your schedule</div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({...formData, yearsExperience: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Tell us about your background, expertise, and what makes you uniquely qualified to help developers..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {specializationOptions.map((spec) => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleSpecializationToggle(spec)}
                          className="mr-2"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                  {formData.specializations.length === 0 && (
                    <p className="text-red-600 text-sm mt-1">Please select at least one specialization</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Hourly Rate (USD) *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      min="50"
                      max="300"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <span className="text-gray-500 ml-2">/hour</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Our consultants typically charge $95-150/hour</p>
                </div>

                <button 
                  type="submit"
                  disabled={formData.specializations.length === 0}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Portfolio
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Portfolio & Links */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Portfolio & Professional Links</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV URL
                  </label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Websites/Projects
                  </label>
                  {formData.portfolioData.websites.map((website, index) => (
                    <input
                      key={index}
                      type="url"
                      value={website}
                      onChange={(e) => {
                        const newWebsites = [...formData.portfolioData.websites]
                        newWebsites[index] = e.target.value
                        setFormData({
                          ...formData,
                          portfolioData: { ...formData.portfolioData, websites: newWebsites }
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                      placeholder={`Portfolio URL ${index + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      portfolioData: { 
                        ...formData.portfolioData, 
                        websites: [...formData.portfolioData.websites, ''] 
                      }
                    })}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add another website
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone *
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Review Your Application</h2>
              
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                    <dl className="mt-2 space-y-1">
                      <div><dt className="inline font-medium">Name:</dt> <dd className="inline">{formData.fullName}</dd></div>
                      <div><dt className="inline font-medium">Experience:</dt> <dd className="inline">{formData.yearsExperience} years</dd></div>
                      <div><dt className="inline font-medium">Rate:</dt> <dd className="inline">${formData.hourlyRate}/hour</dd></div>
                      <div><dt className="inline font-medium">Timezone:</dt> <dd className="inline">{formData.timezone}</dd></div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Specializations</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.specializations.map(spec => (
                        <span key={spec} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Professional Bio</h3>
                  <p className="mt-2 text-gray-600 text-sm">{formData.bio}</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Application Review Process</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Our team will review your application within 3-5 business days</p>
                    <p>• We may contact you for a brief interview or additional information</p>
                    <p>• Upon approval, you'll receive onboarding materials and platform access</p>
                    <p>• You can start accepting client bookings immediately after approval</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for applying to join our expert network. We'll review your application and get back to you within 3-5 business days.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="font-medium text-blue-900 mb-3">What happens next?</h3>
                <div className="text-left text-sm text-blue-800 space-y-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>We'll review your portfolio, experience, and specializations</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Our team may contact you for a brief screening interview</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Upon approval, you'll receive platform access and onboarding materials</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>You can start accepting high-paying client projects immediately</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </Link>
                <Link 
                  href="/marketplace"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Browse Current Consultants
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}