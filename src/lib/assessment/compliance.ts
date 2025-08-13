/**
 * Regulatory Compliance Assessment Engine
 * Evaluates applications for HIPAA, GDPR, CCPA, and PCI compliance
 */

export interface DataType {
  category: string
  description: string
  regulations: string[]
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
  examples: string[]
  detectionPatterns: RegExp[]
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

// Comprehensive data type classification
export const DATA_TYPES: DataType[] = [
  // Personal Identifiers (GDPR Article 4, CCPA)
  {
    category: 'Personal Identifiers',
    description: 'Direct identifiers that can identify an individual',
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    riskLevel: 'critical',
    examples: ['email addresses', 'phone numbers', 'social security numbers', 'passport numbers'],
    detectionPatterns: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{3}-\d{3}-\d{4}\b/g, // Phone
      /\b[A-Z]{1,2}\d{6,8}\b/g, // Passport
    ]
  },
  
  // Financial Data (PCI DSS)
  {
    category: 'Payment Card Data',
    description: 'Credit card numbers, CVV, payment information',
    regulations: ['PCI', 'GDPR', 'CCPA'],
    riskLevel: 'critical',
    examples: ['credit card numbers', 'CVV codes', 'payment tokens', 'bank account numbers'],
    detectionPatterns: [
      /\b4[0-9]{12}(?:[0-9]{3})?\b/g, // Visa
      /\b5[1-5][0-9]{14}\b/g, // Mastercard
      /\b3[47][0-9]{13}\b/g, // Amex
      /\b\d{3,4}\b/g, // CVV (when near card patterns)
    ]
  },
  
  // Protected Health Information (HIPAA)
  {
    category: 'Protected Health Information',
    description: 'Health records, medical data, treatment information',
    regulations: ['HIPAA', 'GDPR'],
    riskLevel: 'critical',
    examples: ['medical records', 'prescription data', 'health insurance info', 'genetic data'],
    detectionPatterns: [
      /\b(medical|health|prescription|diagnosis|treatment|patient|hospital)\b/gi,
      /\b(BMI|blood pressure|cholesterol|glucose|medication)\b/gi,
      /\b(MRN|patient ID|medical record)\b/gi,
    ]
  },
  
  // Biometric Data (GDPR Article 9, CCPA)
  {
    category: 'Biometric Data',
    description: 'Fingerprints, facial recognition, retinal scans',
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    riskLevel: 'critical',
    examples: ['fingerprints', 'facial recognition data', 'voice prints', 'retinal scans'],
    detectionPatterns: [
      /\b(biometric|fingerprint|facial recognition|voice print|retinal scan)\b/gi,
      /\b(face_recognition|biometric_auth|fingerprint_data)\b/gi,
    ]
  },
  
  // Location Data (GDPR, CCPA)
  {
    category: 'Geolocation Data',
    description: 'GPS coordinates, IP addresses, location tracking',
    regulations: ['GDPR', 'CCPA'],
    riskLevel: 'high',
    examples: ['GPS coordinates', 'IP addresses', 'location history', 'geofencing data'],
    detectionPatterns: [
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
      /\b(latitude|longitude|GPS|geolocation)\b/gi,
      /\b(location|coords|position)\b/gi,
    ]
  },
  
  // Behavioral Data (GDPR, CCPA)
  {
    category: 'Behavioral Data',
    description: 'Browsing history, preferences, analytics data',
    regulations: ['GDPR', 'CCPA'],
    riskLevel: 'medium',
    examples: ['browsing history', 'search queries', 'purchase behavior', 'app usage'],
    detectionPatterns: [
      /\b(analytics|tracking|behavior|browsing|clicks|views)\b/gi,
      /\b(google_analytics|facebook_pixel|tracking_id)\b/gi,
    ]
  },
  
  // Authentication Data
  {
    category: 'Authentication Data',
    description: 'Passwords, tokens, security credentials',
    regulations: ['GDPR', 'CCPA', 'PCI'],
    riskLevel: 'critical',
    examples: ['passwords', 'API keys', 'access tokens', 'security questions'],
    detectionPatterns: [
      /\b(password|passwd|pwd|token|api_key|secret)\b/gi,
      /\b(auth|login|credential|jwt|bearer)\b/gi,
    ]
  },
  
  // Communications Data
  {
    category: 'Communications Data',
    description: 'Messages, emails, call logs, communications metadata',
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    riskLevel: 'high',
    examples: ['email content', 'text messages', 'call logs', 'chat history'],
    detectionPatterns: [
      /\b(message|email|chat|communication|conversation)\b/gi,
      /\b(sms|call_log|voice_mail|messaging)\b/gi,
    ]
  },
]

export class ComplianceEngine {
  
  /**
   * Main compliance assessment function
   */
  async assessCompliance(codeContent: string, projectMetadata: any): Promise<ComplianceAssessment> {
    const violations: ComplianceViolation[] = []
    const dataInventory = this.inventoryDataTypes(codeContent)
    
    // Assess each regulation
    const hipaaViolations = this.assessHIPAA(codeContent, dataInventory)
    const gdprViolations = this.assessGDPR(codeContent, dataInventory)
    const ccpaViolations = this.assessCCPA(codeContent, dataInventory)
    const pciViolations = this.assessPCI(codeContent, dataInventory)
    
    violations.push(...hipaaViolations, ...gdprViolations, ...ccpaViolations, ...pciViolations)
    
    // Calculate compliance scores
    const regulatoryScores = {
      hipaa: this.calculateComplianceScore(hipaaViolations),
      gdpr: this.calculateComplianceScore(gdprViolations),
      ccpa: this.calculateComplianceScore(ccpaViolations),
      pci: this.calculateComplianceScore(pciViolations)
    }
    
    const overallCompliance = Math.round(
      (regulatoryScores.hipaa + regulatoryScores.gdpr + regulatoryScores.ccpa + regulatoryScores.pci) / 4
    )
    
    return {
      overallCompliance,
      regulatoryScores,
      violations,
      dataInventory,
      recommendedActions: this.generateRecommendations(violations),
      certificationReadiness: this.assessCertificationReadiness(violations, dataInventory)
    }
  }
  
  /**
   * Inventory data types found in the codebase
   */
  private inventoryDataTypes(codeContent: string) {
    const inventory = {
      personalData: [] as string[],
      sensitiveData: [] as string[],
      financialData: [] as string[],
      healthData: [] as string[],
      biometricData: [] as string[]
    }
    
    DATA_TYPES.forEach(dataType => {
      dataType.detectionPatterns.forEach(pattern => {
        const matches = codeContent.match(pattern)
        if (matches) {
          const categoryKey = this.categorizeDataType(dataType.category)
          if (categoryKey && inventory[categoryKey]) {
            inventory[categoryKey].push(...matches.slice(0, 5)) // Limit examples
          }
        }
      })
    })
    
    return inventory
  }
  
  private categorizeDataType(category: string): keyof typeof inventory | null {
    const inventory = {
      personalData: [] as string[],
      sensitiveData: [] as string[],
      financialData: [] as string[],
      healthData: [] as string[],
      biometricData: [] as string[]
    }
    
    const mapping: { [key: string]: keyof typeof inventory } = {
      'Personal Identifiers': 'personalData',
      'Payment Card Data': 'financialData',
      'Protected Health Information': 'healthData',
      'Biometric Data': 'biometricData',
      'Authentication Data': 'sensitiveData',
      'Communications Data': 'personalData'
    }
    return mapping[category] || null
  }
  
  /**
   * HIPAA Assessment
   */
  private assessHIPAA(codeContent: string, dataInventory: any): ComplianceViolation[] {
    const violations: ComplianceViolation[] = []
    
    // Check for PHI handling
    if (dataInventory.healthData.length > 0) {
      // Administrative Safeguards
      if (!this.hasSecurityOfficer(codeContent)) {
        violations.push({
          regulation: 'HIPAA',
          severity: 'high',
          category: 'Administrative Safeguards',
          description: 'No designated security officer or security management process',
          location: 'Application Configuration',
          dataType: 'PHI Management',
          remediation: 'Implement security management process and designate security officer',
          references: ['45 CFR § 164.308(a)(2)']
        })
      }
      
      // Physical Safeguards
      if (!this.hasDataEncryption(codeContent)) {
        violations.push({
          regulation: 'HIPAA',
          severity: 'critical',
          category: 'Physical Safeguards',
          description: 'PHI not encrypted at rest and in transit',
          location: 'Data Storage/Transmission',
          dataType: 'Protected Health Information',
          remediation: 'Implement AES-256 encryption for data at rest and TLS 1.3 for data in transit',
          references: ['45 CFR § 164.312(a)(2)(iv)', '45 CFR § 164.312(e)(2)(ii)']
        })
      }
      
      // Technical Safeguards
      if (!this.hasAccessControls(codeContent)) {
        violations.push({
          regulation: 'HIPAA',
          severity: 'high',
          category: 'Technical Safeguards',
          description: 'Insufficient access controls for PHI',
          location: 'Authentication System',
          dataType: 'Protected Health Information',
          remediation: 'Implement role-based access controls with unique user identification',
          references: ['45 CFR § 164.312(a)(1)']
        })
      }
      
      // Audit Controls
      if (!this.hasAuditLogging(codeContent)) {
        violations.push({
          regulation: 'HIPAA',
          severity: 'medium',
          category: 'Technical Safeguards',
          description: 'No audit logging for PHI access and modifications',
          location: 'Logging System',
          dataType: 'Protected Health Information',
          remediation: 'Implement comprehensive audit logging for all PHI access and modifications',
          references: ['45 CFR § 164.312(b)']
        })
      }
    }
    
    return violations
  }
  
  /**
   * GDPR Assessment
   */
  private assessGDPR(codeContent: string, dataInventory: any): ComplianceViolation[] {
    const violations: ComplianceViolation[] = []
    
    if (dataInventory.personalData.length > 0) {
      // Lawful Basis
      if (!this.hasConsentMechanism(codeContent)) {
        violations.push({
          regulation: 'GDPR',
          severity: 'critical',
          category: 'Lawful Basis',
          description: 'No clear consent mechanism for personal data processing',
          location: 'Data Collection Forms',
          dataType: 'Personal Data',
          remediation: 'Implement clear, specific, and informed consent mechanisms',
          references: ['GDPR Article 6', 'GDPR Article 7']
        })
      }
      
      // Data Subject Rights
      if (!this.hasDataSubjectRights(codeContent)) {
        violations.push({
          regulation: 'GDPR',
          severity: 'high',
          category: 'Data Subject Rights',
          description: 'No mechanism for data subject rights (access, rectification, erasure)',
          location: 'User Account Management',
          dataType: 'Personal Data',
          remediation: 'Implement data portability, right to erasure, and rectification mechanisms',
          references: ['GDPR Article 15-22']
        })
      }
      
      // Data Protection by Design
      if (!this.hasDataMinimization(codeContent)) {
        violations.push({
          regulation: 'GDPR',
          severity: 'medium',
          category: 'Data Protection by Design',
          description: 'No evidence of data minimization principles',
          location: 'Data Collection',
          dataType: 'Personal Data',
          remediation: 'Implement data minimization - collect only necessary data',
          references: ['GDPR Article 5(1)(c)', 'GDPR Article 25']
        })
      }
      
      // International Transfers
      if (this.hasInternationalTransfers(codeContent)) {
        violations.push({
          regulation: 'GDPR',
          severity: 'high',
          category: 'International Transfers',
          description: 'International data transfers without adequate safeguards',
          location: 'Third-party Integrations',
          dataType: 'Personal Data',
          remediation: 'Implement Standard Contractual Clauses or adequacy decisions',
          references: ['GDPR Chapter V (Articles 44-49)']
        })
      }
    }
    
    return violations
  }
  
  /**
   * CCPA Assessment
   */
  private assessCCPA(codeContent: string, dataInventory: any): ComplianceViolation[] {
    const violations: ComplianceViolation[] = []
    
    if (dataInventory.personalData.length > 0) {
      // Consumer Rights
      if (!this.hasOptOutMechanism(codeContent)) {
        violations.push({
          regulation: 'CCPA',
          severity: 'high',
          category: 'Consumer Rights',
          description: 'No "Do Not Sell My Personal Information" opt-out mechanism',
          location: 'Privacy Controls',
          dataType: 'Personal Information',
          remediation: 'Implement clear opt-out mechanism for data sale',
          references: ['CCPA Section 1798.135']
        })
      }
      
      // Privacy Policy
      if (!this.hasPrivacyPolicy(codeContent)) {
        violations.push({
          regulation: 'CCPA',
          severity: 'medium',
          category: 'Transparency',
          description: 'No comprehensive privacy policy addressing CCPA requirements',
          location: 'Legal Pages',
          dataType: 'Personal Information',
          remediation: 'Create detailed privacy policy with data categories and purposes',
          references: ['CCPA Section 1798.130']
        })
      }
      
      // Data Deletion
      if (!this.hasDataDeletion(codeContent)) {
        violations.push({
          regulation: 'CCPA',
          severity: 'medium',
          category: 'Consumer Rights',
          description: 'No mechanism for consumers to request data deletion',
          location: 'Account Management',
          dataType: 'Personal Information',
          remediation: 'Implement data deletion request and fulfillment process',
          references: ['CCPA Section 1798.105']
        })
      }
    }
    
    return violations
  }
  
  /**
   * PCI DSS Assessment
   */
  private assessPCI(codeContent: string, dataInventory: any): ComplianceViolation[] {
    const violations: ComplianceViolation[] = []
    
    if (dataInventory.financialData.length > 0) {
      // Requirement 3: Protect stored cardholder data
      if (this.storesCardData(codeContent)) {
        violations.push({
          regulation: 'PCI',
          severity: 'critical',
          category: 'Data Storage',
          description: 'Cardholder data stored without proper protection',
          location: 'Payment Processing',
          dataType: 'Payment Card Data',
          remediation: 'Do not store sensitive authentication data; encrypt stored cardholder data',
          references: ['PCI DSS Requirement 3']
        })
      }
      
      // Requirement 4: Encrypt transmission of cardholder data
      if (!this.hasSecureTransmission(codeContent)) {
        violations.push({
          regulation: 'PCI',
          severity: 'critical',
          category: 'Data Transmission',
          description: 'Cardholder data transmitted without encryption',
          location: 'Payment API',
          dataType: 'Payment Card Data',
          remediation: 'Use strong cryptography (TLS 1.2+) for cardholder data transmission',
          references: ['PCI DSS Requirement 4']
        })
      }
      
      // Requirement 8: Identify and authenticate access
      if (!this.hasStrongAuthentication(codeContent)) {
        violations.push({
          regulation: 'PCI',
          severity: 'high',
          category: 'Access Control',
          description: 'Weak authentication for payment system access',
          location: 'Authentication System',
          dataType: 'Payment System Access',
          remediation: 'Implement multi-factor authentication and strong password policies',
          references: ['PCI DSS Requirement 8']
        })
      }
      
      // Requirement 10: Track and monitor access
      if (!this.hasPaymentAuditing(codeContent)) {
        violations.push({
          regulation: 'PCI',
          severity: 'medium',
          category: 'Monitoring',
          description: 'Insufficient logging of payment system access',
          location: 'Audit System',
          dataType: 'Payment System Logs',
          remediation: 'Implement comprehensive logging and monitoring of payment system access',
          references: ['PCI DSS Requirement 10']
        })
      }
    }
    
    return violations
  }
  
  /**
   * Helper methods for compliance checks
   */
  private hasSecurityOfficer(code: string): boolean {
    return /security.*(officer|manager|admin)/gi.test(code) ||
           /admin.*(security|privacy)/gi.test(code)
  }
  
  private hasDataEncryption(code: string): boolean {
    return /(encrypt|AES|TLS|SSL|crypto)/gi.test(code) &&
           /(256|512|1024)/g.test(code)
  }
  
  private hasAccessControls(code: string): boolean {
    return /(role.*based|RBAC|access.*control|permission)/gi.test(code) &&
           /(authenticate|authorize)/gi.test(code)
  }
  
  private hasAuditLogging(code: string): boolean {
    return /(audit|log|track).*access/gi.test(code) ||
           /(winston|bunyan|sentry).*log/gi.test(code)
  }
  
  private hasConsentMechanism(code: string): boolean {
    return /(consent|agree|accept).*privacy/gi.test(code) ||
           /(gdpr|cookie.*consent)/gi.test(code)
  }
  
  private hasDataSubjectRights(code: string): boolean {
    return /(delete.*account|export.*data|download.*data)/gi.test(code) ||
           /(data.*portability|right.*erasure)/gi.test(code)
  }
  
  private hasDataMinimization(code: string): boolean {
    return /(only.*necessary|minimal.*data|required.*field)/gi.test(code)
  }
  
  private hasInternationalTransfers(code: string): boolean {
    return /(amazonaws|cloudflare|googlecloud).*eu/gi.test(code) ||
           /(transfer.*international|cross.*border)/gi.test(code)
  }
  
  private hasOptOutMechanism(code: string): boolean {
    return /(do.*not.*sell|opt.*out|unsubscribe)/gi.test(code)
  }
  
  private hasPrivacyPolicy(code: string): boolean {
    return /(privacy.*policy|data.*policy)/gi.test(code)
  }
  
  private hasDataDeletion(code: string): boolean {
    return /(delete.*data|remove.*information|purge.*records)/gi.test(code)
  }
  
  private storesCardData(code: string): boolean {
    return /(store|save|persist).*card/gi.test(code) ||
           /(credit.*card.*number|cvv|card.*holder)/gi.test(code)
  }
  
  private hasSecureTransmission(code: string): boolean {
    return /(https|tls|ssl).*payment/gi.test(code) ||
           /(stripe|paypal).*secure/gi.test(code)
  }
  
  private hasStrongAuthentication(code: string): boolean {
    return /(mfa|2fa|multi.*factor|two.*factor)/gi.test(code)
  }
  
  private hasPaymentAuditing(code: string): boolean {
    return /(payment.*log|transaction.*audit|payment.*monitor)/gi.test(code)
  }
  
  /**
   * Calculate compliance score based on violations
   */
  private calculateComplianceScore(violations: ComplianceViolation[]): number {
    if (violations.length === 0) return 100
    
    const severityWeights = { critical: 25, high: 15, medium: 10, low: 5 }
    const totalDeduction = violations.reduce((sum, v) => sum + severityWeights[v.severity], 0)
    
    return Math.max(0, 100 - totalDeduction)
  }
  
  /**
   * Generate recommendations based on violations
   */
  private generateRecommendations(violations: ComplianceViolation[]): string[] {
    const recommendations = new Set<string>()
    
    violations.forEach(violation => {
      recommendations.add(violation.remediation)
    })
    
    // Add general recommendations
    recommendations.add("Conduct regular compliance audits and assessments")
    recommendations.add("Implement privacy by design principles in development")
    recommendations.add("Establish data governance and retention policies")
    recommendations.add("Train staff on data protection and privacy requirements")
    recommendations.add("Create incident response procedures for data breaches")
    
    return Array.from(recommendations)
  }
  
  /**
   * Assess certification readiness
   */
  private assessCertificationReadiness(violations: ComplianceViolation[], dataInventory: any) {
    const regulationViolations = {
      HIPAA: violations.filter(v => v.regulation === 'HIPAA'),
      GDPR: violations.filter(v => v.regulation === 'GDPR'),
      CCPA: violations.filter(v => v.regulation === 'CCPA'),
      PCI: violations.filter(v => v.regulation === 'PCI')
    }
    
    return {
      HIPAA: {
        ready: regulationViolations.HIPAA.length === 0 && dataInventory.healthData.length === 0,
        missingRequirements: regulationViolations.HIPAA.map(v => v.category),
        estimatedEffort: this.estimateEffort(regulationViolations.HIPAA.length)
      },
      GDPR: {
        ready: regulationViolations.GDPR.length === 0,
        missingRequirements: regulationViolations.GDPR.map(v => v.category),
        estimatedEffort: this.estimateEffort(regulationViolations.GDPR.length)
      },
      CCPA: {
        ready: regulationViolations.CCPA.length === 0,
        missingRequirements: regulationViolations.CCPA.map(v => v.category),
        estimatedEffort: this.estimateEffort(regulationViolations.CCPA.length)
      },
      PCI: {
        ready: regulationViolations.PCI.length === 0 && dataInventory.financialData.length === 0,
        missingRequirements: regulationViolations.PCI.map(v => v.category),
        estimatedEffort: this.estimateEffort(regulationViolations.PCI.length)
      }
    }
  }
  
  private estimateEffort(violationCount: number): string {
    if (violationCount === 0) return "Ready for certification"
    if (violationCount <= 2) return "1-2 weeks"
    if (violationCount <= 5) return "1-2 months"
    if (violationCount <= 10) return "3-6 months"
    return "6+ months"
  }
}