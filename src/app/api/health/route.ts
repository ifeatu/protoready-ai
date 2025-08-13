import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check database connectivity
    let dbStatus = 'unknown'
    let dbResponseTime = 0
    
    if (supabase) {
      try {
        const dbStart = Date.now()
        await supabase.from('user_subscriptions').select('count').limit(1)
        dbResponseTime = Date.now() - dbStart
        dbStatus = 'healthy'
      } catch (error) {
        dbStatus = 'unhealthy'
        console.error('Database health check failed:', error)
      }
    } else {
      dbStatus = 'not_configured'
    }

    // Check environment variables
    const envChecks = {
      supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      stripe: !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY),
      app_url: !!process.env.NEXT_PUBLIC_APP_URL
    }

    const allEnvHealthy = Object.values(envChecks).every(check => check)
    const totalResponseTime = Date.now() - startTime

    const healthData = {
      status: dbStatus === 'healthy' && allEnvHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`
        },
        environment: {
          status: allEnvHealthy ? 'healthy' : 'missing_vars',
          checks: envChecks
        }
      },
      performance: {
        responseTime: `${totalResponseTime}ms`,
        memoryUsage: process.memoryUsage()
      }
    }

    // Return appropriate status code
    const statusCode = healthData.status === 'healthy' ? 200 : 503

    return NextResponse.json(healthData, { status: statusCode })
    
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal health check error'
    }, { status: 500 })
  }
}