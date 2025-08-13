'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { SUBSCRIPTION_PLANS, formatPrice } from '@/lib/stripe'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planType: string) => {
    setIsLoading(planType)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: 'demo-user', // In real app, get from auth
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        })
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? Math.round(price * 0.8) : price // 20% annual discount
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your production readiness needs. 
              Start free and upgrade as you scale.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-800">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, plan]) => {
              const isPopular = planKey === 'basic'
              const price = getDiscountedPrice(plan.price)
              
              return (
                <Card 
                  key={planKey}
                  className={`relative ${isPopular ? 'border-indigo-200 border-2 shadow-lg' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.price > 0 && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{formatPrice(plan.price)}</span>
                        <span className="text-green-600 ml-2">Save 20%</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${isPopular ? '' : 'variant-outline'}`}
                      onClick={() => planKey !== 'free' ? handleSubscribe(planKey) : null}
                      disabled={isLoading === planKey}
                      asChild={planKey === 'free'}
                    >
                      {planKey === 'free' ? (
                        <Link href="/assessment">
                          Start Free Assessment
                        </Link>
                      ) : (
                        <>
                          {isLoading === planKey ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Subscribe to {plan.name}
                            </>
                          )}
                        </>
                      )}
                    </Button>

                    {planKey !== 'free' && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Cancel anytime • No setup fees
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Compare Features
            </h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-900">Features</th>
                        <th className="text-center py-4 px-6 font-medium text-gray-900">Free</th>
                        <th className="text-center py-4 px-6 font-medium text-gray-900">Basic</th>
                        <th className="text-center py-4 px-6 font-medium text-gray-900">Professional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-4 px-6 font-medium">Monthly Assessments</td>
                        <td className="text-center py-4 px-6">3</td>
                        <td className="text-center py-4 px-6">Unlimited</td>
                        <td className="text-center py-4 px-6">Unlimited</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-6 font-medium">Detailed Reports</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium">Consultant Access</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-4 px-6 font-medium">Priority Support</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium">SOC 2 Compliance</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">—</td>
                        <td className="text-center py-4 px-6">
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately 
                  and we&apos;ll prorate any charges.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, MasterCard, American Express) and PayPal 
                  through our secure Stripe integration.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">
                  Our Free plan gives you 3 assessments per month forever. You can upgrade anytime 
                  to unlock additional features.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does consultant matching work?</h3>
                <p className="text-gray-600 text-sm">
                  Professional plan users get access to our vetted consultant marketplace. We match you 
                  with experts based on your project needs and technology stack.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Make Your App Production-Ready?</h2>
                <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of developers who have successfully deployed their AI-built applications to production.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}