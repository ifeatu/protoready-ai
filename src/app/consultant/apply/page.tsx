'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Shield,
  User,
  Briefcase,
  Star,
  Globe,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'security' | 'mobile' | 'other'
}

interface Certification {
  name: string
  issuer: string
  year: string
  url?: string
}

const SKILL_CATEGORIES = {
  frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  backend: ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB'],
  devops: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Azure'],
  security: ['OWASP', 'Penetration Testing', 'Compliance', 'Cryptography'],
  mobile: ['React Native', 'Flutter', 'iOS', 'Android'],
  other: ['Machine Learning', 'Data Science', 'Blockchain', 'UI/UX Design']
}

export default function ConsultantApplyPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    linkedIn: '',
    github: '',
    website: ''
  })

  const [professionalInfo, setProfessionalInfo] = useState({
    title: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    availableHours: '',
    communicationPreference: 'video'
  })

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [portfolio, setPortfolio] = useState({
    resume: null as File | null,
    portfolioUrl: '',
    caseStudies: [] as { title: string; description: string; url: string }[]
  })

  const handleSkillToggle = (skillName: string, category: string) => {
    const skill: Skill = { id: Date.now().toString(), name: skillName, category: category as any }
    
    if (selectedSkills.find(s => s.name === skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s.name !== skillName))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', year: '' }])
  }

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Simulate application submission
    setTimeout(() => {
      setIsLoading(false)
      setStep(4) // Success step
    }, 2000)
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
            placeholder="San Francisco, CA"
            required
          />
        </div>
        <div>
          <Label htmlFor="timezone">Timezone *</Label>
          <Input
            id="timezone"
            value={personalInfo.timezone}
            onChange={(e) => setPersonalInfo({...personalInfo, timezone: e.target.value})}
            placeholder="PST (UTC-8)"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Professional Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              id="linkedIn"
              value={personalInfo.linkedIn}
              onChange={(e) => setPersonalInfo({...personalInfo, linkedIn: e.target.value})}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              value={personalInfo.github}
              onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
              placeholder="https://github.com/johndoe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => setPersonalInfo({...personalInfo, website: e.target.value})}
            placeholder="https://johndoe.dev"
          />
        </div>
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Professional Title *</Label>
        <Input
          id="title"
          value={professionalInfo.title}
          onChange={(e) => setProfessionalInfo({...professionalInfo, title: e.target.value})}
          placeholder="Senior Full-Stack Developer"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experience">Years of Experience *</Label>
          <Input
            id="experience"
            type="number"
            value={professionalInfo.experience}
            onChange={(e) => setProfessionalInfo({...professionalInfo, experience: e.target.value})}
            placeholder="5"
            required
          />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={professionalInfo.hourlyRate}
            onChange={(e) => setProfessionalInfo({...professionalInfo, hourlyRate: e.target.value})}
            placeholder="75"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Professional Bio *</Label>
        <Textarea
          id="bio"
          value={professionalInfo.bio}
          onChange={(e) => setProfessionalInfo({...professionalInfo, bio: e.target.value})}
          placeholder="Tell us about your background, expertise, and what makes you a great consultant..."
          rows={4}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {professionalInfo.bio.length}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="availableHours">Available Hours/Week</Label>
          <Input
            id="availableHours"
            type="number"
            value={professionalInfo.availableHours}
            onChange={(e) => setProfessionalInfo({...professionalInfo, availableHours: e.target.value})}
            placeholder="20"
          />
        </div>
        <div>
          <Label htmlFor="communication">Preferred Communication</Label>
          <select
            id="communication"
            value={professionalInfo.communicationPreference}
            onChange={(e) => setProfessionalInfo({...professionalInfo, communicationPreference: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="video">Video Calls</option>
            <option value="audio">Audio Calls</option>
            <option value="chat">Text Chat</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* Skills Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills & Expertise</h3>
        <p className="text-sm text-gray-600">Select all technologies and areas you're proficient in:</p>
        
        {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 capitalize">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.find(s => s.name === skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill, category)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        
        <p className="text-sm text-gray-500">
          Selected: {selectedSkills.length} skills
        </p>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Certifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCertification}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
        
        {certifications.map((cert, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div>
                <Label>Issuing Organization</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label>Year</Label>
                  <Input
                    value={cert.year}
                    onChange={(e) => updateCertification(index, 'year', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCertification(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPortfolioInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="resume">Resume/CV Upload</Label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="resume"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input id="resume" name="resume" type="file" className="sr-only" accept=".pdf,.doc,.docx" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="portfolioUrl">Portfolio Website</Label>
        <Input
          id="portfolioUrl"
          value={portfolio.portfolioUrl}
          onChange={(e) => setPortfolio({...portfolio, portfolioUrl: e.target.value})}
          placeholder="https://yourportfolio.com"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Case Studies & Projects</h3>
        <p className="text-sm text-gray-600">
          Share 2-3 relevant projects that demonstrate your expertise
        </p>
        
        {/* For demo purposes, showing static case study inputs */}
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>Project Title</Label>
              <Input placeholder="E-commerce Platform Modernization" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Migrated legacy monolith to microservices architecture, improving performance by 300%..."
                rows={3}
              />
            </div>
            <div>
              <Label>Project URL (optional)</Label>
              <Input placeholder="https://github.com/johndoe/ecommerce-modernization" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Application Review Process</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Initial review within 24 hours</li>
          <li>• Background verification (1-2 business days)</li>
          <li>• Technical interview with our team</li>
          <li>• Reference checks</li>
          <li>• Final approval and onboarding</li>
        </ul>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="text-gray-600 mt-2">
          Thank you for your interest in joining ProtoReady.ai as a consultant.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-left">
        <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. We'll review your application within 24 hours</li>
          <li>2. If selected, you'll receive an email for the next steps</li>
          <li>3. Complete background verification process</li>
          <li>4. Schedule a technical interview</li>
          <li>5. Once approved, start taking on projects!</li>
        </ul>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Application ID: <span className="font-mono font-medium">APP-{Date.now()}</span>
        </p>
        
        <div className="flex space-x-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )

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
            <Button variant="outline" asChild>
              <Link href="/marketplace">Marketplace</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {step < 4 && (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">Join Our Consultant Network</h1>
                  <span className="text-sm text-gray-500">Step {step} of 3</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className={step >= 1 ? 'text-indigo-600 font-medium' : ''}>Personal Info</span>
                  <span className={step >= 2 ? 'text-indigo-600 font-medium' : ''}>Professional</span>
                  <span className={step >= 3 ? 'text-indigo-600 font-medium' : ''}>Portfolio</span>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {step === 1 && <User className="h-5 w-5 mr-2" />}
                    {step === 2 && <Briefcase className="h-5 w-5 mr-2" />}
                    {step === 3 && <Star className="h-5 w-5 mr-2" />}
                    {step === 1 && 'Personal Information'}
                    {step === 2 && 'Professional Experience'}
                    {step === 3 && 'Portfolio & Projects'}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && 'Tell us about yourself and how we can contact you'}
                    {step === 2 && 'Share your professional background and expertise'}
                    {step === 3 && 'Showcase your work and demonstrate your capabilities'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {step === 1 && renderPersonalInfo()}
                  {step === 2 && renderProfessionalInfo()}
                  {step === 3 && renderPortfolioInfo()}

                  <div className="flex justify-between pt-6 mt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>
                    
                    {step < 3 ? (
                      <Button onClick={() => setStep(step + 1)}>
                        Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 4 && renderSuccess()}
        </div>
      </main>
    </div>
  )
}