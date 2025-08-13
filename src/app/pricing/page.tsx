'use client'

import { useState } from 'react'
import { 
  Check,
  Shield,
  Zap,
  Users,
  Star,
  ArrowRight,
  CreditCard,
  Clock,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out our platform',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Basic readiness score',
        '3 assessments per month',
        'High-level recommendations',
        'Community support'
      ],
      popular: false,
      cta: 'Start Free'
    },
    {
      name: 'Basic',
      description: 'For developers ready to go to production',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Unlimited assessments',
        'Detailed technical reports',
        'Remediation roadmaps',
        'Priority support',
        'Security analysis',
        'Performance insights'
      ],
      popular: true,
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      description: 'For teams and serious projects',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Everything in Basic',
        'Enterprise compliance analysis',
        'Consultant matching',
        'Implementation guidance',
        'SOC 2/ISO 27001 prep',
        'Custom integrations',
        'Dedicated support'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ]

  const getPrice = (plan: any) => {
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
    return price === 0 ? 'Free' : `$${price}`
  }

  const getPeriod = () => {
    return isAnnual ? '/year' : '/month'
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
            <Link href="/assessment" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Try Free Assessment
            </Link>
            <Link href="/auth" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gray-200"
                style={{ backgroundColor: isAnnual ? '#4F46E5' : '#E5E7EB' }}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAnnual ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div key={plan.name} className={`bg-white rounded-xl border shadow-sm relative ${plan.popular ? 'border-indigo-200 border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {getPrice(plan)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-600 ml-1">{getPeriod()}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={plan.name === 'Free' ? '/assessment' : '/auth'}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors ${
                      plan.popular
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="bg-white rounded-xl border shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What's Included
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Assessment Features */}
              <div className="text-center">
                <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comprehensive Assessment
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Code quality analysis</li>
                  <li>• Security vulnerability scan</li>
                  <li>• Performance bottleneck detection</li>
                  <li>• Deployment readiness check</li>
                  <li>• Best practices validation</li>
                </ul>
              </div>

              {/* Compliance Features */}
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Compliance & Security
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GDPR compliance check</li>
                  <li>• HIPAA readiness assessment</li>
                  <li>• SOC 2 preparation guidance</li>
                  <li>• Data protection audit</li>
                  <li>• Security best practices</li>
                </ul>
              </div>

              {/* Support Features */}
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Expert Support
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Access to expert consultants</li>
                  <li>• Implementation guidance</li>
                  <li>• Code review sessions</li>
                  <li>• Deployment assistance</li>
                  <li>• Priority support channels</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl border shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens after the assessment?
                </h3>
                <p className="text-gray-600 text-sm">
                  You'll receive a detailed report with specific recommendations and can connect with our expert consultants to implement the suggested improvements.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I upgrade or downgrade anytime?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Make Your App Production-Ready?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start with a free assessment and see how we can help you bridge the gap from prototype to production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/marketplace" className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Browse Consultants
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}