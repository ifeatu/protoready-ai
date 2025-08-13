import { AssessmentInput, AssessmentResult, Finding, RemediationPhase, Task } from '@/types/assessment'
import { ComplianceEngine, ComplianceAssessment } from './compliance'

export class AssessmentEngine {
  private complianceEngine = new ComplianceEngine()
  private securityPatterns = {
    vulnerabilities: [
      /password.*=.*["\'].*["\']/, // Hardcoded passwords
      /api[_-]?key.*=.*["\'].*["\']/, // Hardcoded API keys
      /secret.*=.*["\'].*["\']/, // Hardcoded secrets
      /console\.log\(/gi, // Console.log statements
      /eval\(/gi, // Eval usage
      /document\.write\(/gi, // Document.write usage
      /innerHTML.*=.*[^"]/, // Direct innerHTML without sanitization
      /\$\{.*\}/, // Template literal injection risks
    ],
    goodPatterns: [
      /process\.env\./gi, // Environment variables
      /bcrypt/gi, // Password hashing
      /helmet/gi, // Security middleware
      /cors/gi, // CORS middleware
      /rate.*limit/gi, // Rate limiting
      /csrf/gi, // CSRF protection
    ]
  }

  private performancePatterns = {
    issues: [
      /for.*in.*for.*in/gi, // Nested loops
      /\.map\(.*\.map\(/gi, // Nested maps
      /setTimeout.*setTimeout/gi, // Multiple timeouts
      /setInterval/gi, // Intervals without cleanup
      /fetch.*fetch/gi, // Multiple fetch calls
      /new.*Date\(\)/gi, // Excessive date creation
    ],
    optimizations: [
      /useMemo/gi, // React memoization
      /useCallback/gi, // Callback memoization
      /React\.memo/gi, // Component memoization
      /lazy\(/gi, // Lazy loading
      /Suspense/gi, // Suspense boundaries
      /import\(.*\)/gi, // Dynamic imports
    ]
  }

  private scalabilityPatterns = {
    concerns: [
      /localStorage/gi, // Client-side storage
      /sessionStorage/gi, // Session storage
      /document\./gi, // Direct DOM manipulation
      /window\./gi, // Window object usage
      /alert\(/gi, // Alert dialogs
      /confirm\(/gi, // Confirm dialogs
    ],
    goodPractices: [
      /useState/gi, // State management
      /useEffect/gi, // Effect management
      /useContext/gi, // Context usage
      /redux/gi, // State management
      /zustand/gi, // State management
      /react-query/gi, // Data fetching
    ]
  }

  async analyzeCode(input: AssessmentInput): Promise<AssessmentResult> {
    const startTime = Date.now()
    
    const findings: Finding[] = []
    const { codeOutput, toolType, projectType } = input

    // Security Analysis
    const securityFindings = this.analyzeSecurityIssues(codeOutput)
    findings.push(...securityFindings)

    // Performance Analysis
    const performanceFindings = this.analyzePerformanceIssues(codeOutput)
    findings.push(...performanceFindings)

    // Scalability Analysis
    const scalabilityFindings = this.analyzeScalabilityIssues(codeOutput)
    findings.push(...scalabilityFindings)

    // Maintainability Analysis
    const maintainabilityFindings = this.analyzeMaintainabilityIssues(codeOutput)
    findings.push(...maintainabilityFindings)

    // Framework-specific analysis
    const frameworkFindings = this.analyzeFrameworkSpecific(codeOutput, toolType)
    findings.push(...frameworkFindings)

    // Regulatory Compliance Analysis
    const complianceAssessment = await this.complianceEngine.assessCompliance(codeOutput, {
      projectType,
      toolType,
      findings
    })

    // Calculate scores
    const securityScore = this.calculateSecurityScore(securityFindings)
    const performanceScore = this.calculatePerformanceScore(performanceFindings)
    const scalabilityScore = this.calculateScalabilityScore(scalabilityFindings)
    const maintainabilityScore = this.calculateMaintainabilityScore(maintainabilityFindings)

    const overallScore = Math.round(
      (securityScore * 0.3 + performanceScore * 0.25 + scalabilityScore * 0.25 + maintainabilityScore * 0.2)
    )

    // Generate remediation roadmap
    const remediationRoadmap = this.generateRemediationRoadmap(findings)

    // Determine deployment readiness
    const deploymentReadiness = this.determineDeploymentReadiness(overallScore, findings)

    const assessmentDuration = Date.now() - startTime

    return {
      overallScore,
      securityRating: this.getSecurityRating(securityScore),
      scalabilityIndex: Math.min(5, Math.max(1, Math.round(scalabilityScore / 20))),
      maintainabilityGrade: this.getMaintainabilityGrade(maintainabilityScore),
      deploymentReadiness,
      detailedFindings: findings,
      remediationRoadmap,
      estimatedCost: this.estimateImplementationCost(remediationRoadmap),
      complianceAssessment
    }
  }

  private analyzeSecurityIssues(code: string): Finding[] {
    const findings: Finding[] = []

    // Check for security vulnerabilities
    this.securityPatterns.vulnerabilities.forEach((pattern, index) => {
      const matches = code.match(pattern)
      if (matches) {
        const severity = index < 3 ? 'critical' : index < 6 ? 'high' : 'medium'
        findings.push({
          category: 'security',
          severity: severity as 'critical' | 'high' | 'medium' | 'low',
          title: this.getSecurityIssueTitle(index),
          description: this.getSecurityIssueDescription(index),
          recommendation: this.getSecurityRecommendation(index),
          effort: severity === 'critical' ? 'high' : severity === 'high' ? 'medium' : 'low'
        })
      }
    })

    // Check for missing security measures
    const hasEnvironmentVars = code.includes('process.env')
    const hasPasswordHashing = /bcrypt|argon2|scrypt/.test(code)
    const hasSecurityMiddleware = /helmet|cors|rate.*limit/i.test(code)

    if (!hasEnvironmentVars) {
      findings.push({
        category: 'security',
        severity: 'high',
        title: 'Missing Environment Variable Usage',
        description: 'Configuration values should be stored in environment variables',
        recommendation: 'Use process.env for all configuration values and secrets',
        effort: 'medium'
      })
    }

    if (!hasPasswordHashing && /password|auth/i.test(code)) {
      findings.push({
        category: 'security',
        severity: 'critical',
        title: 'Missing Password Hashing',
        description: 'Authentication system detected without proper password hashing',
        recommendation: 'Implement bcrypt or argon2 for password hashing',
        effort: 'high'
      })
    }

    return findings
  }

  private analyzePerformanceIssues(code: string): Finding[] {
    const findings: Finding[] = []

    // Check for performance anti-patterns
    this.performancePatterns.issues.forEach((pattern, index) => {
      const matches = code.match(pattern)
      if (matches) {
        findings.push({
          category: 'performance',
          severity: 'medium',
          title: this.getPerformanceIssueTitle(index),
          description: this.getPerformanceIssueDescription(index),
          recommendation: this.getPerformanceRecommendation(index),
          effort: 'medium'
        })
      }
    })

    // Check for missing performance optimizations
    const hasLazyLoading = /lazy\(|Suspense/i.test(code)
    const hasMemoization = /useMemo|useCallback|React\.memo/i.test(code)
    const hasCodeSplitting = /import\(.*\)/.test(code)

    if (!hasLazyLoading && code.length > 10000) {
      findings.push({
        category: 'performance',
        severity: 'medium',
        title: 'Missing Lazy Loading',
        description: 'Large codebase without lazy loading can impact initial load time',
        recommendation: 'Implement lazy loading for routes and components',
        effort: 'medium'
      })
    }

    return findings
  }

  private analyzeScalabilityIssues(code: string): Finding[] {
    const findings: Finding[] = []

    // Check for scalability concerns
    this.scalabilityPatterns.concerns.forEach((pattern, index) => {
      const matches = code.match(pattern)
      if (matches && matches.length > 5) {
        findings.push({
          category: 'scalability',
          severity: 'medium',
          title: this.getScalabilityIssueTitle(index),
          description: this.getScalabilityIssueDescription(index),
          recommendation: this.getScalabilityRecommendation(index),
          effort: 'medium'
        })
      }
    })

    // Check for state management
    const hasStateManagement = /redux|zustand|context/i.test(code)
    const hasDataFetching = /react-query|swr|apollo/i.test(code)

    if (!hasStateManagement && code.includes('useState')) {
      const stateCount = (code.match(/useState/g) || []).length
      if (stateCount > 10) {
        findings.push({
          category: 'scalability',
          severity: 'high',
          title: 'Complex State Management',
          description: `Found ${stateCount} useState hooks without centralized state management`,
          recommendation: 'Consider implementing Redux, Zustand, or Context API for state management',
          effort: 'high'
        })
      }
    }

    return findings
  }

  private analyzeMaintainabilityIssues(code: string): Finding[] {
    const findings: Finding[] = []

    // Check code complexity
    const functionCount = (code.match(/function\s+\w+|const\s+\w+\s*=/g) || []).length
    const lineCount = code.split('\n').length
    const avgFunctionSize = lineCount / Math.max(functionCount, 1)

    if (avgFunctionSize > 50) {
      findings.push({
        category: 'maintainability',
        severity: 'medium',
        title: 'Large Function Size',
        description: `Average function size is ${Math.round(avgFunctionSize)} lines`,
        recommendation: 'Break down large functions into smaller, focused functions',
        effort: 'medium'
      })
    }

    // Check for documentation
    const hasComments = /\/\*|\/\//.test(code)
    const hasTypeScript = /interface|type\s+\w+\s*=/.test(code)

    if (!hasComments && lineCount > 100) {
      findings.push({
        category: 'maintainability',
        severity: 'low',
        title: 'Missing Documentation',
        description: 'Code lacks comments and documentation',
        recommendation: 'Add comments explaining complex logic and business rules',
        effort: 'low'
      })
    }

    if (!hasTypeScript && /\.js|\.jsx/.test(code)) {
      findings.push({
        category: 'maintainability',
        severity: 'medium',
        title: 'Missing TypeScript',
        description: 'JavaScript codebase without type safety',
        recommendation: 'Migrate to TypeScript for better type safety and developer experience',
        effort: 'high'
      })
    }

    return findings
  }

  private analyzeFrameworkSpecific(code: string, toolType: string): Finding[] {
    const findings: Finding[] = []

    switch (toolType) {
      case 'lovable':
      case 'replit':
        // React/Next.js specific checks
        if (code.includes('React') || code.includes('next')) {
          if (!code.includes('key=') && code.includes('.map(')) {
            findings.push({
              category: 'maintainability',
              severity: 'medium',
              title: 'Missing React Keys',
              description: 'List rendering without proper keys detected',
              recommendation: 'Add unique keys to list items for better React performance',
              effort: 'low'
            })
          }
        }
        break

      case 'bolt':
        // Check for proper error boundaries
        if (!code.includes('ErrorBoundary') && code.includes('throw')) {
          findings.push({
            category: 'maintainability',
            severity: 'medium',
            title: 'Missing Error Boundaries',
            description: 'Error throwing code without proper error boundaries',
            recommendation: 'Implement React Error Boundaries for better error handling',
            effort: 'medium'
          })
        }
        break
    }

    return findings
  }

  private calculateSecurityScore(findings: Finding[]): number {
    const securityFindings = findings.filter(f => f.category === 'security')
    let score = 100

    securityFindings.forEach(finding => {
      switch (finding.severity) {
        case 'critical': score -= 25; break
        case 'high': score -= 15; break
        case 'medium': score -= 8; break
        case 'low': score -= 3; break
      }
    })

    return Math.max(0, score)
  }

  private calculatePerformanceScore(findings: Finding[]): number {
    const performanceFindings = findings.filter(f => f.category === 'performance')
    let score = 100

    performanceFindings.forEach(finding => {
      switch (finding.severity) {
        case 'critical': score -= 20; break
        case 'high': score -= 12; break
        case 'medium': score -= 6; break
        case 'low': score -= 2; break
      }
    })

    return Math.max(0, score)
  }

  private calculateScalabilityScore(findings: Finding[]): number {
    const scalabilityFindings = findings.filter(f => f.category === 'scalability')
    let score = 100

    scalabilityFindings.forEach(finding => {
      switch (finding.severity) {
        case 'critical': score -= 20; break
        case 'high': score -= 12; break
        case 'medium': score -= 6; break
        case 'low': score -= 2; break
      }
    })

    return Math.max(0, score)
  }

  private calculateMaintainabilityScore(findings: Finding[]): number {
    const maintainabilityFindings = findings.filter(f => f.category === 'maintainability')
    let score = 100

    maintainabilityFindings.forEach(finding => {
      switch (finding.severity) {
        case 'critical': score -= 15; break
        case 'high': score -= 10; break
        case 'medium': score -= 5; break
        case 'low': score -= 2; break
      }
    })

    return Math.max(0, score)
  }

  private getSecurityRating(score: number): 'critical' | 'high' | 'medium' | 'low' {
    if (score < 40) return 'critical'
    if (score < 60) return 'high'
    if (score < 80) return 'medium'
    return 'low'
  }

  private getMaintainabilityGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  private determineDeploymentReadiness(score: number, findings: Finding[]): 'ready' | 'needs-work' | 'not-ready' {
    const criticalIssues = findings.filter(f => f.severity === 'critical').length
    const highIssues = findings.filter(f => f.severity === 'high').length

    if (criticalIssues > 0 || score < 40) return 'not-ready'
    if (highIssues > 3 || score < 70) return 'needs-work'
    return 'ready'
  }

  private generateRemediationRoadmap(findings: Finding[]): RemediationPhase[] {
    const phases: RemediationPhase[] = []

    // Phase 1: Critical Issues (0-30 days)
    const criticalFindings = findings.filter(f => f.severity === 'critical')
    if (criticalFindings.length > 0) {
      phases.push({
        phase: 1,
        title: 'Critical Security & Stability Fixes',
        description: 'Address critical vulnerabilities and stability issues that prevent production deployment',
        priority: 'critical',
        estimatedDays: 15,
        tasks: criticalFindings.map((finding, index) => ({
          id: `critical-${index}`,
          title: finding.title,
          description: finding.recommendation,
          category: finding.category,
          effort: this.effortToHours(finding.effort)
        }))
      })
    }

    // Phase 2: High Priority Issues (30-60 days)
    const highFindings = findings.filter(f => f.severity === 'high')
    if (highFindings.length > 0) {
      phases.push({
        phase: 2,
        title: 'High Priority Improvements',
        description: 'Implement important security and performance improvements',
        priority: 'high',
        estimatedDays: 30,
        tasks: highFindings.map((finding, index) => ({
          id: `high-${index}`,
          title: finding.title,
          description: finding.recommendation,
          category: finding.category,
          effort: this.effortToHours(finding.effort)
        }))
      })
    }

    // Phase 3: Medium Priority Issues (60-90 days)
    const mediumFindings = findings.filter(f => f.severity === 'medium')
    if (mediumFindings.length > 0) {
      phases.push({
        phase: 3,
        title: 'Quality & Performance Enhancements',
        description: 'Improve code quality, performance, and maintainability',
        priority: 'medium',
        estimatedDays: 45,
        tasks: mediumFindings.map((finding, index) => ({
          id: `medium-${index}`,
          title: finding.title,
          description: finding.recommendation,
          category: finding.category,
          effort: this.effortToHours(finding.effort)
        }))
      })
    }

    return phases
  }

  private effortToHours(effort: string): number {
    switch (effort) {
      case 'low': return 4
      case 'medium': return 16
      case 'high': return 40
      default: return 8
    }
  }

  private estimateImplementationCost(roadmap: RemediationPhase[]): { min: number, max: number } {
    const totalHours = roadmap.reduce((total, phase) => 
      total + phase.tasks.reduce((phaseTotal, task) => phaseTotal + task.effort, 0), 0
    )

    const hourlyRate = 100 // Average consultant rate
    const minRate = 75
    const maxRate = 150

    return {
      min: totalHours * minRate,
      max: totalHours * maxRate
    }
  }

  // Helper methods for issue descriptions
  private getSecurityIssueTitle(index: number): string {
    const titles = [
      'Hardcoded Password Detected',
      'Hardcoded API Key Found',
      'Hardcoded Secret Exposed',
      'Console Logging in Production',
      'Dangerous eval() Usage',
      'Unsafe document.write() Usage',
      'XSS Vulnerability Risk',
      'Template Injection Risk'
    ]
    return titles[index] || 'Security Issue Detected'
  }

  private getSecurityIssueDescription(index: number): string {
    const descriptions = [
      'Hardcoded passwords in source code pose a critical security risk',
      'API keys should never be hardcoded in source code',
      'Secrets and sensitive data must be stored securely',
      'Console.log statements can leak sensitive information in production',
      'eval() function can execute malicious code and should be avoided',
      'document.write() can lead to XSS vulnerabilities',
      'Direct innerHTML assignment without sanitization risks XSS attacks',
      'Template literals with user input can lead to injection attacks'
    ]
    return descriptions[index] || 'Security vulnerability detected'
  }

  private getSecurityRecommendation(index: number): string {
    const recommendations = [
      'Use environment variables and secure password hashing (bcrypt, argon2)',
      'Store API keys in environment variables and use secure key management',
      'Move all secrets to environment variables or secret management systems',
      'Remove console.log statements and implement proper logging solutions',
      'Replace eval() with safer alternatives like JSON.parse() or Function constructor',
      'Use safer DOM manipulation methods like textContent or proper templating',
      'Sanitize all user input before setting innerHTML or use textContent',
      'Validate and sanitize all user input in template literals'
    ]
    return recommendations[index] || 'Address security vulnerability'
  }

  private getPerformanceIssueTitle(index: number): string {
    const titles = [
      'Nested Loop Performance Issue',
      'Nested Array Operations',
      'Multiple setTimeout Usage',
      'Unmanaged setInterval',
      'Multiple Fetch Calls',
      'Excessive Date Object Creation'
    ]
    return titles[index] || 'Performance Issue Detected'
  }

  private getPerformanceIssueDescription(index: number): string {
    const descriptions = [
      'Nested loops can cause O(n²) complexity and performance issues',
      'Chained .map() operations can be inefficient for large datasets',
      'Multiple setTimeout calls can impact performance and user experience',
      'setInterval without proper cleanup can cause memory leaks',
      'Multiple fetch calls should be batched or optimized',
      'Excessive Date object creation can impact performance'
    ]
    return descriptions[index] || 'Performance bottleneck detected'
  }

  private getPerformanceRecommendation(index: number): string {
    const recommendations = [
      'Optimize nested loops or use more efficient algorithms',
      'Consider using reduce() or combining operations for better performance',
      'Batch operations or use requestAnimationFrame for better timing',
      'Always clear intervals and implement proper cleanup',
      'Implement request batching or use libraries like react-query',
      'Cache Date objects or use more efficient date handling'
    ]
    return recommendations[index] || 'Optimize performance bottleneck'
  }

  private getScalabilityIssueTitle(index: number): string {
    const titles = [
      'Client-Side Storage Limitations',
      'Session Storage Scalability',
      'Direct DOM Manipulation',
      'Window Object Dependencies',
      'User Alert Dialog Usage',
      'Blocking Confirm Dialogs'
    ]
    return titles[index] || 'Scalability Issue Detected'
  }

  private getScalabilityIssueDescription(index: number): string {
    const descriptions = [
      'localStorage has size limitations and can affect performance',
      'sessionStorage is limited and not suitable for large-scale applications',
      'Direct DOM manipulation can cause performance issues at scale',
      'Heavy window object usage can limit scalability across environments',
      'Alert dialogs provide poor user experience and are not scalable',
      'Confirm dialogs block user interaction and hurt user experience'
    ]
    return descriptions[index] || 'Scalability concern detected'
  }

  private getScalabilityRecommendation(index: number): string {
    const recommendations = [
      'Implement server-side storage or use IndexedDB for larger datasets',
      'Use proper state management solutions like Redux or Context API',
      'Use React state management and avoid direct DOM manipulation',
      'Minimize window object usage and use React patterns instead',
      'Replace alerts with proper UI notifications and toast messages',
      'Implement modal dialogs or proper confirmation UI components'
    ]
    return recommendations[index] || 'Improve scalability architecture'
  }
}

export const assessmentEngine = new AssessmentEngine()