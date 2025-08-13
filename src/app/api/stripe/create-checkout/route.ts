import { NextRequest, NextResponse } from 'next/server'
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const { planType, userId, successUrl, cancelUrl } = await request.json()

    if (!planType || !userId) {
      return NextResponse.json(
        { error: 'Plan type and user ID are required' },
        { status: 400 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS]
    if (!plan || !plan.priceId) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let customerId: string

    if (supabase) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      if (subscription?.stripe_customer_id) {
        customerId = subscription.stripe_customer_id
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          metadata: {
            userId: userId
          }
        })
        customerId = customer.id

        // Update database with customer ID
        await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            subscription_tier: 'free'
          })
      }
    } else {
      // Create customer without database
      const customer = await stripe.customers.create({
        metadata: {
          userId: userId
        }
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl || `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planType: planType
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planType: planType
        }
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}