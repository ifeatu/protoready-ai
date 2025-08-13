import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Mock webhook handler for deployment - replace with real Stripe webhook handling later
    return NextResponse.json({
      received: true,
      message: 'Webhook received but not yet implemented'
    })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}