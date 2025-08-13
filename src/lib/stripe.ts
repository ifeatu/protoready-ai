import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Server-side Stripe
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic readiness score',
      '3 assessments per month',
      'High-level recommendations',
      'Community support'
    ],
    limits: {
      assessments: 3,
      detailedReports: false,
      consultantAccess: false,
      prioritySupport: false
    }
  },
  basic: {
    name: 'Basic',
    price: 29,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      'Detailed technical reports',
      'Unlimited assessments', 
      'Remediation roadmaps',
      'Priority support',
      'PDF export'
    ],
    limits: {
      assessments: -1, // unlimited
      detailedReports: true,
      consultantAccess: false,
      prioritySupport: true
    }
  },
  professional: {
    name: 'Professional',
    price: 99,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    features: [
      'Enterprise compliance analysis',
      'Consultant matching',
      'Implementation guidance',
      'SOC 2/ISO 27001 prep',
      'Custom integrations',
      'Dedicated support'
    ],
    limits: {
      assessments: -1, // unlimited
      detailedReports: true,
      consultantAccess: true,
      prioritySupport: true
    }
  }
}

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS

// Helper functions
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

export const getPlanByPriceId = (priceId: string): SubscriptionPlan | null => {
  for (const [planKey, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      return planKey as SubscriptionPlan
    }
  }
  return null
}

export const canAccessFeature = (
  userPlan: SubscriptionPlan,
  feature: keyof typeof SUBSCRIPTION_PLANS.free.limits
): boolean => {
  return SUBSCRIPTION_PLANS[userPlan].limits[feature] as boolean
}