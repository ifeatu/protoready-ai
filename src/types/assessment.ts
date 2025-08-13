export interface AssessmentInput {
  toolType: 'lovable' | 'replit' | 'bolt' | 'cursor' | 'github'
  codeOutput: string
  projectType: string
  projectDescription?: string
}

export interface ComplianceAssessment {
  overallCompliance: number
  regulatoryScores: {
    hipaa: number
    gdpr: number
    ccpa: number
    pci: number
  }
  violations: ComplianceViolation[]
  dataInventory: {
    personalData: string[]
    sensitiveData: string[]
    financialData: string[]
    healthData: string[]
    biometricData: string[]
  }
  recommendedActions: string[]
  certificationReadiness: {
    [regulation: string]: {
      ready: boolean
      missingRequirements: string[]
      estimatedEffort: string
    }
  }
}

export interface ComplianceViolation {
  regulation: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  description: string
  location: string
  dataType: string
  remediation: string
  references: string[]
}

export interface AssessmentResult {
  overallScore: number // 0-100
  securityRating: 'critical' | 'high' | 'medium' | 'low'
  scalabilityIndex: number // 1-5
  maintainabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  deploymentReadiness: 'ready' | 'needs-work' | 'not-ready'
  detailedFindings: Finding[]
  remediationRoadmap: RemediationPhase[]
  estimatedCost?: {
    min: number
    max: number
  }
  complianceAssessment?: ComplianceAssessment
}

export interface Finding {
  category: 'security' | 'performance' | 'maintainability' | 'scalability' | 'deployment'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  location?: string
  recommendation: string
  effort: 'low' | 'medium' | 'high'
}

export interface RemediationPhase {
  phase: number
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedDays: number
  tasks: Task[]
}

export interface Task {
  id: string
  title: string
  description: string
  category: string
  effort: number // hours
  dependencies?: string[]
}

export interface ToolPrompt {
  toolType: AssessmentInput['toolType']
  name: string
  description: string
  prompt: string
  expectedOutput: string[]
}